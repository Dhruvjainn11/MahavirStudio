'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '@/app/context/adminContext';

export const useOrders = ({
  page = 1,
  limit = 10,
  search = '',
  status = '',
  paymentStatus = '',
}) => {
  const { getAuthHeaders } = useAdmin();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`,
        {
          params: {
            page: currentPage,
            limit,
            search,
            status,
            paymentStatus,
          },
          headers: getAuthHeaders(),
        }
      );

      setOrders(res.data.data.orders);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(res.data.data.currentPage);
      setError(null);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError(err?.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

const useOrderDetails = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}` , {
            headers: getAuthHeaders(),
        });
        setOrder(data.data);
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, status, paymentStatus]);

  return {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    refetch: fetchOrders,useOrderDetails
  };
};
