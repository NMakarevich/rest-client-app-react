import { useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { User } from 'firebase/auth';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mock,
  test,
  vi,
} from 'vitest';

import SignUpPage from '@/app/[locale]/(auth)/signup/page';

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
    usePathname: vi.fn(() => '/signup'),
  })),
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    actual,
    useEffect: vi.fn(),
    useState: vi.fn(),
  };
});

const useStateMock: Mock<typeof useState> = useState as never;

const setValue = vi.fn();
useStateMock.mockImplementation(() => [false, setValue]);

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

describe('SignUpPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  test('renders sign-up form', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SignUpPage />
      </NextIntlClientProvider>
    );
    waitFor(() => {
      expect(screen.getByText('Sign Up')).toBeTruthy();
      expect(screen.getByLabelText('Display Name')).toBeTruthy();
      expect(screen.getByLabelText('Email')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeTruthy();
    });
  });

  test('shows password visibility toggle', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SignUpPage />
      </NextIntlClientProvider>
    );
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByTestId('eye');
    waitFor(() => {
      expect(passwordInput).haveOwnProperty('type', 'Password');
    });

    fireEvent.click(toggleButton);
    waitFor(() => {
      expect(passwordInput).haveOwnProperty('type', 'text');
    });

    fireEvent.click(toggleButton);
    waitFor(() => {
      expect(passwordInput).haveOwnProperty('type', 'password');
    });
  });
});
