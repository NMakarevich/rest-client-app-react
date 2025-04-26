'use client';
import { User } from 'firebase/auth';

import { Link } from '@/i18n/navigation';

type UserGreetingProps = {
  user: User;
  t: (key: string) => string;
};

export const UserGreeting = ({ user, t }: UserGreetingProps) => {
  return (
    <>
      <p className="w-full text-center text-3xl">
        {t('welcome')}
        <span className="text-amber-600 font-medium">{user.displayName}</span>!
      </p>
      <div className="w-full flex justify-around gap-3">
        <Link
          href="/GET"
          className="h-10 w-30 flex justify-center items-center bg-lime-300 border border-gray-300 rounded-lg shadow-xs hover:bg-lime-400 transition-colors"
        >
          {t('links.restclient')}
        </Link>
        <Link
          href="/history"
          className="h-10 w-30 flex bg-lime-300 justify-center items-center rounded-lg border border-gray-300 shadow-xs hover:bg-lime-400 transition-colors"
        >
          {t('links.history')}
        </Link>
        <Link
          href="/variables"
          className="h-10 w-30 flex p-1 bg-lime-300 justify-center items-center rounded-lg border border-gray-300 shadow-xs hover:bg-lime-400 transition-colors"
        >
          {t('links.variables')}
        </Link>
      </div>
    </>
  );
};
