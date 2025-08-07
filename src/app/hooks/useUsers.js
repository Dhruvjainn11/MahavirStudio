'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdmin } from '@/app/context/adminContext';

export const useUsers = ({ page = 1, search = '' }) => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);
  const { getAuthHeaders } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
          {
            params: { page: currentPage, search },
            headers: getAuthHeaders(),
          }
        );

        const { users = [], pagination = {} } = res.data.data;

        setUsers(users);
        setTotalPages(pagination.totalPages || 1);
        setCurrentPage(pagination.currentPage || 1);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, search, refetchIndex,getAuthHeaders]);


  const refetch = () => setRefetchIndex((i) => i + 1);

    const getUserById = async (userId) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
        { headers: getAuthHeaders() }
      );
      return res.data.data;
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      throw new Error('Could not load user details');
    }
  };

  return {
    users,
    totalPages,
    currentPage,
    loading,
    error,
    setCurrentPage,
    refetch,
    getUserById
  };
};
