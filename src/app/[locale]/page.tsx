'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Loader } from '@/components/shared/loader';
import { Developer } from '@/components/welcome-page/developer';
import { UserGreeting } from '@/components/welcome-page/user-greeting';
import { useAuth } from '@/context/auth-context';
import { developers } from '@/utils';

export default function WelcomePage() {
  const t = useTranslations('welcomePage');
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState(user?.displayName);
  const [activeTab, setActiveTab] = useState<'rest' | 'team'>('rest');

  const handleTabChange = (tab: 'rest' | 'team') => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (user) {
      console.log('user', user, user.displayName);
      console.log('displayName', user.displayName);
    }
    setUserName(user?.displayName);
  }, [user]);

  useEffect(() => {
    console.log('userName', userName);
  }, [userName]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="flex flex-col h-full w-full justify-between items-center my-0 p-5 mx-auto gap-4 primary-color-bg">
      <div className="flex flex-col flex-grow w-full h-full items-center">
        <div className="flex justify-center gap-5">
          <button
            className={`flex h-10 w-42 items-center justify-center cursor-pointer ${
              activeTab === 'rest'
                ? 'primary-color-component-bg'
                : 'bg-gray-300'
            }`}
            onClick={() => handleTabChange('rest')}
          >
            {t('tabs.rest')}
          </button>
          <button
            className={`flex h-10 w-42 items-center justify-center cursor-pointer ${
              activeTab === 'team'
                ? 'primary-color-component-bg'
                : 'bg-gray-300'
            }`}
            onClick={() => handleTabChange('team')}
          >
            {t('tabs.team')}
          </button>
        </div>

        <div className="w-full min-h-80 p-6 flex items-center primary-color-component-bg">
          <div className="flex flex-col w-full items-center mx-auto px-4 gap-5">
            <h2 className="w-full text-center text-xl font-medium ">
              {activeTab === 'rest'
                ? t('title_main.rest')
                : t('title_main.team')}
            </h2>
            <p className="max-w-7xl w-3/4 text-center">
              {activeTab === 'rest'
                ? t('description_restAppText')
                : t('description_ourTeamText')}
            </p>
          </div>
        </div>
        <div
          className="w-0 h-0 
            border-l-[20px] border-l-transparent
            border-t-[25px] border-t-gray-50
            border-r-[20px] border-r-transparent"
        ></div>
      </div>

      <div className="flex flex-wrap justify-center gap-5 w-full max-w-7xl">
        {!!userName && user && <UserGreeting user={user} t={t} />}
      </div>

      <h2 className="w-full text-center text-xl">{t('title1')}</h2>
      <h3 className="w-full text-center text-l">{t('title2')}</h3>
      <div className="flex flex-wrap justify-center gap-5 w-full max-w-7xl">
        {developers.map((dev) => (
          <ul
            key={dev.id}
            className="w-full sm:w-auto sm:flex-1 sm:min-w-[calc(33.33%-16px)] flex"
          >
            <Developer key={dev.id} {...dev} />
          </ul>
        ))}
      </div>
    </section>
  );
}
