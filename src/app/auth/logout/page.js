// src/app/auth/logout/page.js

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function Logout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/logout');
      if (res.status === 200) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Logout failed:', error?.response?.data?.error || error.message);
      setError('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  }, [router]);

  // Auto-logout when the page loads
  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <h1 className="text-6xl font-bold mb-6">Logging Out</h1>
        {error ? (
          <div className="mb-4 text-red-500">{error}</div>
        ) : (
          <p className="mb-6">Please wait while we log you out...</p>
        )}
        
        {error && (
          <Button 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Try Again'}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="mt-4"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}