import { NextIntlClientProvider } from 'next-intl';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import SignInPage from '@/app/[locale]/(auth)/signin/page';

const messages = {
  loading: 'Loading...',
  auth: {
    signInTitle: 'Sign In',
    signUpTitle: 'Sign Up',
    displayName: 'Name',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signIn_description_part1: "Don't have an account,",
    signUp_description_part1: 'Already have an account,',
    signIn_description_part2: 'create an account',
    signUp_description_part2: 'log in',
    errors: {
      displayName_required: 'Display name is required',
      email_required: 'Email is required',
      email_invalid: 'Invalid email format',
      password_required: 'Password is required',
      password_min: 'Password must be at least 8 characters',
      password:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character(@#$!%*?&<>',
      auth_failed: 'Authentication failed',
      email_already_used: 'This email is already registered',
    },
  },
};

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    actual,
    createUserWithEmailAndPassword: vi.fn(),
    updateProfile: vi.fn(),
    getAuth: vi.fn().mockReturnValue({ currentUser: null }),
  };
});

vi.mock('@/context/auth-context', () => ({
  useAuth: vi.fn(() => ({
    user: null,
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
    usePathname: vi.fn(() => '/signin'),
  })),
}));

describe('SignInPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  test('renders sign-in form', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SignInPage />
      </NextIntlClientProvider>
    );
    waitFor(() => {
      expect(screen.getByText('Sign In')).toBeTruthy();
      expect(screen.getByLabelText('Display Name')).toBeTruthy();
      expect(screen.getByLabelText('Email')).toBeTruthy();
      expect(screen.getByLabelText('password')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
    });
  });

  test('shows password visibility toggle', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SignInPage />
      </NextIntlClientProvider>
    );
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByTestId('eye');
    await waitFor(() => {
      expect(passwordInput.type).toBe('password');
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('text');
    });

    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('password');
    });
  });
});
