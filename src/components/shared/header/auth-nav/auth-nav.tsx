'use client';

import { useTranslations } from 'next-intl';

import { useAuth } from '@/context/auth-context';
import { Link, useRouter } from '@/i18n/navigation';
import { signOut } from '@/lib/auth';

export function AuthNav() {
  const t = useTranslations('header');
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error sign out:', error);
    }
  };

  if (loading) {
    return <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>;
  }

  return (
    <>
      {user ? (
        <button
          className={
            'text-cyan-800 text-xl font-medium hover:text-cyan-600  cursor-pointer'
          }
          onClick={handleSignOut}
        >
          {t('logout')}
        </button>
      ) : (
        <>
          <Link
            href="/signup"
            scroll={false}
            className={
              'text-cyan-800  text-xl font-medium hover:text-cyan-600  cursor-pointer '
            }
          >
            {t('signup')}
          </Link>

          <Link
            href="/signin"
            scroll={false}
            className={
              'text-cyan-800  text-xl font-medium hover:text-cyan-600 cursor-pointer '
            }
          >
            {t('signin')}
          </Link>
        </>
      )}
    </>
  );
}
