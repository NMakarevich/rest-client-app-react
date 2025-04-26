'use client';

import { Suspense } from 'react';

import { AuthNav } from './auth-nav';
import { HeaderLogo } from './header-logo';
import { LanguageSelect } from './select-lang';

export function Header() {
  return (
    <header className="flex flex-0 w-full justify-between flex-wrap px-5 py-3 gap-4 items-center relative">
      <HeaderLogo />
      <Suspense>
        <AuthNav />
      </Suspense>
      <Suspense>
        <LanguageSelect />
      </Suspense>
    </header>
  );
}
