'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
interface AuthUser {
  email: string | undefined;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  const checkUser = useCallback(async () => {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    const adminEmail = sessionStorage.getItem('admin_email');
    
    if (!isAuthenticated || !adminEmail) {
      router.push('/admin/login');
    } else {
      setUser({ email: adminEmail });
    }
    setLoading(false);
  }, [router]); // Add router to useCallback dependencies

  useEffect(() => {
    checkUser();
  }, [checkUser]); // Add checkUser to useEffect dependencies

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_email');
    router.push('/admin/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 mr-4">Admin Panel</h1>
              <a href="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              <a href="/admin/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Products</a>
              <a href="/admin/orders" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Orders</a>
              <a href="/admin/import" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Import Products</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
