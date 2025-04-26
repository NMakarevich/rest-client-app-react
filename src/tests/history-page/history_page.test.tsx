import { NextIntlClientProvider } from 'next-intl';
import { render, screen, waitFor } from '@testing-library/react';
import { User } from 'firebase/auth';
import { describe, expect, test, vi } from 'vitest';

import HistoryPage from '@/app/[locale]/history/page';

vi.mock('@/context/auth-context', () => ({
  useAuth: vi.fn(() => ({
    user: {} as User,
    loading: false,
  })),
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: vi.fn(() => ({
    useRouter() {
      return {
        push: () => vi.fn(),
        replace: () => vi.fn(),
      };
    },
    usePathname: vi.fn(() => '/history'),
  })),
}));

const messages = {
  loading: 'Loading...',
  historyPage: {
    title: 'History',
    loadingPage: 'Loading History Page...',
    loadSavedRequests: 'Loading...',
    loading: 'Loading...',
  },
};

describe('HistoryPage Component', () => {
  test('renders correctly history page', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HistoryPage />
      </NextIntlClientProvider>
    );

    waitFor(() => {
      expect(screen.getByText('History'));
    });
  });
});
