'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; id: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now(); // Unique ID for each toast
    setToast({ message, type, id });
    setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        setToast(null); // Clear toast after it hides
      }, 3000); // Toast visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && ( // Render toast only if it exists
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white text-center transition-all duration-300 transform
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
            z-50`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};










