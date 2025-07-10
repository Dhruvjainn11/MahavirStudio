'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from '../utils/debounce';

export const useTableState = (options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    initialSearch = '',
    initialFilters = {},
    initialSort = { field: 'createdAt', order: 'desc' },
    storageKey = null, // If provided, will persist state in localStorage
    debounceMs = 300
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params or localStorage
  const initializeState = useCallback(() => {
    const urlPage = searchParams.get('page');
    const urlSearch = searchParams.get('search');
    const urlLimit = searchParams.get('limit');
    
    let savedState = {};
    if (storageKey && typeof window !== 'undefined') {
      try {
        savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
      } catch (e) {
        console.warn('Failed to parse saved table state:', e);
      }
    }

    return {
      page: parseInt(urlPage) || savedState.page || initialPage,
      limit: parseInt(urlLimit) || savedState.limit || initialLimit,
      search: urlSearch || savedState.search || initialSearch,
      filters: { ...initialFilters, ...savedState.filters },
      sort: savedState.sort || initialSort
    };
  }, [searchParams, storageKey, initialPage, initialLimit, initialSearch, initialFilters, initialSort]);

  const [state, setState] = useState(initializeState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save state to localStorage
  const saveState = useCallback((newState) => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState));
      } catch (e) {
        console.warn('Failed to save table state:', e);
      }
    }
  }, [storageKey]);

  // Update URL with current state
  const updateURL = useCallback((newState) => {
    const params = new URLSearchParams();
    
    if (newState.page > 1) params.set('page', newState.page.toString());
    if (newState.search) params.set('search', newState.search);
    if (newState.limit !== initialLimit) params.set('limit', newState.limit.toString());
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(newURL, { shallow: true });
  }, [router, initialLimit]);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((searchTerm) => {
      setState(prev => {
        const newState = { ...prev, search: searchTerm, page: 1 };
        saveState(newState);
        updateURL(newState);
        return newState;
      });
    }, debounceMs),
    [debounceMs, saveState, updateURL]
  );

  // Action creators
  const actions = useMemo(() => ({
    setPage: (page) => {
      setState(prev => {
        const newState = { ...prev, page };
        saveState(newState);
        updateURL(newState);
        return newState;
      });
    },

    setSearch: (search) => {
      debouncedSearch(search);
    },

    setFilter: (key, value) => {
      setState(prev => {
        const newState = {
          ...prev,
          filters: { ...prev.filters, [key]: value },
          page: 1
        };
        saveState(newState);
        updateURL(newState);
        return newState;
      });
    },

    setSort: (field, order = 'asc') => {
      setState(prev => {
        const newState = { ...prev, sort: { field, order }, page: 1 };
        saveState(newState);
        updateURL(newState);
        return newState;
      });
    },

    setLimit: (limit) => {
      setState(prev => {
        const newState = { ...prev, limit, page: 1 };
        saveState(newState);
        updateURL(newState);
        return newState;
      });
    },

    reset: () => {
      const newState = {
        page: initialPage,
        limit: initialLimit,
        search: initialSearch,
        filters: initialFilters,
        sort: initialSort
      };
      setState(newState);
      saveState(newState);
      updateURL(newState);
    },

    setLoading,
    setError
  }), [
    debouncedSearch, saveState, updateURL,
    initialPage, initialLimit, initialSearch, initialFilters, initialSort
  ]);

  // Build query parameters for API calls
  const queryParams = useMemo(() => {
    const params = {
      page: state.page,
      limit: state.limit,
      sortBy: state.sort.field,
      sortOrder: state.sort.order
    };

    if (state.search) params.search = state.search;
    
    Object.entries(state.filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    return params;
  }, [state]);

  return {
    state,
    actions,
    queryParams,
    loading,
    error
  };
};
