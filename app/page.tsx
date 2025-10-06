'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (user) {
        router.push('/home');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-slate-950 dark:to-slate-900">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">読み込み中...</p>
      </div>
    </div>
  );
}
