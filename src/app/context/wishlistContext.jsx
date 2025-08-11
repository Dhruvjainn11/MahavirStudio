// context/WishlistContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/components/Toast';
import { useAuth } from '@/app/context/authContext';

const WishlistContext = createContext(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();
   
    const { user, token, isLoading: authLoading } = useAuth();
    
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api';

    // Local (guest) wishlist persistence
    const LOCAL_WISHLIST_KEY = 'mahavir_wishlist_items';

    const loadLocalWishlist = () => {
        try {
            const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (_e) {
            return [];
        }
    };

    const saveLocalWishlist = (items) => {
        try {
            localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(items));
        } catch (_e) {}
    };

    const addLocalWishlistItem = (productId) => {
        const existing = loadLocalWishlist();
        if (existing.some((it) => it.productId === productId)) return existing;
        const updated = [...existing, { productId, addedAt: new Date().toISOString() }];
        saveLocalWishlist(updated);
        return updated;
    };

    const removeLocalWishlistItem = (productId) => {
        const existing = loadLocalWishlist();
        const updated = existing.filter((it) => it.productId !== productId);
        saveLocalWishlist(updated);
        return updated;
    };

    const clearLocalWishlist = () => {
        try { localStorage.removeItem(LOCAL_WISHLIST_KEY); } catch (_e) {}
    };

    // Hydrate guest wishlist with product details to match server shape
    const hydrateLocalWishlist = useCallback(async () => {
        const stored = loadLocalWishlist();
        if (!stored.length) return [];
        const results = await Promise.allSettled(
            stored.map(async (it) => {
                const res = await fetch(`${BASE_API_URL}/products/${it.productId}`);
                const product = await res.json();
                return {
                    _id: it.productId, // synthetic id equals productId for guest mode
                    productId: product,
                    addedAt: it.addedAt || new Date().toISOString(),
                };
            })
        );
        return results
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value);
    }, [BASE_API_URL]);

    const apiCall = useCallback(async (method, endpoint, data = null) => {
        const url = `${BASE_API_URL}${endpoint}`;

        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            };

            if (data) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            const result = await response.json();

            // FIX: This is the critical change for fetch API.
            // Check if the response status is NOT OK (e.g., 400, 500)
            if (!response.ok) {
                // If the response is not ok, throw an error with the message from the backend
                throw new Error(result.message || response.statusText || 'Something went wrong');
            }
            
            return result;
        } catch (err) {
            console.error(`API Error for ${url}:`, err);
            error(err.message || 'An unexpected error occurred during API call.');
            throw err;
        }
    }, [token, error, BASE_API_URL]);

    const fetchWishlist = useCallback(async () => {
        // Authenticated: fetch from server
        if (user && token) {
            setLoading(true);
            try {
                const data = await apiCall('GET', '/wishlist');
                const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
                setWishlistItems(items);
            } catch (_err) {
                setWishlistItems([]);
            } finally {
                setLoading(false);
            }
            return;
        }

        // Guest: hydrate from localStorage
        setLoading(true);
        try {
            const hydrated = await hydrateLocalWishlist();
            setWishlistItems(hydrated);
        } catch (_e) {
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    }, [apiCall, user, token, hydrateLocalWishlist]);

    const addToWishlist = useCallback(async (productId) => {
        // Guest mode
        if (!user || !token) {
            addLocalWishlistItem(productId);
            const hydrated = await hydrateLocalWishlist();
            setWishlistItems(hydrated);
            success('Product added to wishlist!');
            return true;
        }

        // Authenticated
        try {
            const updatedWishlist = await apiCall('POST', '/wishlist', { productId });
            const items = Array.isArray(updatedWishlist) ? updatedWishlist : (updatedWishlist?.items ?? []);
            setWishlistItems(items);
            success('Product added to wishlist!');
            return true;
        } catch (err) {
            if (err.message?.toLowerCase().includes('already in wishlist')) {
                await fetchWishlist();
                error('This product is already in your wishlist.');
                return true;
            }
            return false;
        }
    }, [apiCall, fetchWishlist, success, error, user, token, hydrateLocalWishlist]);

    const removeFromWishlist = useCallback(async (wishlistItemId) => {
        // Guest mode: wishlistItemId is productId for hydrated items
        if (!user || !token) {
            removeLocalWishlistItem(wishlistItemId);
            const hydrated = await hydrateLocalWishlist();
            setWishlistItems(hydrated);
            success('Product removed from wishlist!');
            return true;
        }

        try {
            const updatedWishlist = await apiCall('DELETE', `/wishlist/${wishlistItemId}`);
            const items = Array.isArray(updatedWishlist) ? updatedWishlist : (updatedWishlist?.items ?? []);
            setWishlistItems(items);
            success('Product removed from wishlist!');
            return true;
        } catch (_err) {
            return false;
        }
    }, [apiCall, success, user, token, hydrateLocalWishlist]);

    const isProductInWishlist = useCallback((productId) => {
        return wishlistItems.some(item =>
            item.productId?._id === productId || item.productId === productId
        );
    }, [wishlistItems]);

    useEffect(() => {
        if (authLoading) return; // wait until auth resolves

        if (user && token) {
            // Merge local (guest) wishlist into server on login
            (async () => {
                const localItems = loadLocalWishlist();
                if (localItems.length) {
                    await Promise.allSettled(
                        localItems.map((it) => apiCall('POST', '/wishlist', { productId: it.productId }).catch(() => {}))
                    );
                    clearLocalWishlist();
                }
                await fetchWishlist();
            })();
        } else {
            // Guest mode: show local wishlist
            (async () => {
                const hydrated = await hydrateLocalWishlist();
                setWishlistItems(hydrated);
                setLoading(false);
            })();
        }
    }, [authLoading, user, token, apiCall, fetchWishlist, hydrateLocalWishlist]);

    const contextValue = {
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        fetchWishlist,
    };

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};