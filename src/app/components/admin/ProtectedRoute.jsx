  'use client';

  import { useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAdmin } from '../../context/adminContext';

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdmin();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/admin/login');
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-gray-600 mt-4">Checking authentication...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return children;
  };

  export default ProtectedRoute;
