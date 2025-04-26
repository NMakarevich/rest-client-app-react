import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['be', 'en', 'ru'],
  defaultLocale: 'be',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
