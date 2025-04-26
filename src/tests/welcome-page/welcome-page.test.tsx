import { NextIntlClientProvider } from 'next-intl';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { User } from 'firebase/auth';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import WelcomePage from '@/app/[locale]/page';

vi.mock('@/context/auth-context', () => ({
  useAuth: vi.fn(() => ({
    user: {
      displayName: 'Test',
    } as User,
    loading: false,
  })),
}));

vi.mock('next-intl/navigation', () => ({
  createNavigation: vi.fn(() => ({
    useRouter: vi.fn(() => ({
      push: () => vi.fn(),
      replace: () => vi.fn(),
    })),
    usePathname: vi.fn(() => '/'),
    Link: vi.fn(),
  })),
}));

const messages = {
  loading: 'Loading...',
  welcomePage: {
    description_restAppText:
      'A powerful REST API integrated development environment (IDE). This tool provides everything you need to build, test, and debug RESTful services. Key features: smart code completion, interactive API testing, built-in documentation, and team collaboration support. Perfect for developers, testers, and API architects.',
    description_ourTeamText:
      'Our team consists of experienced developers specializing in modern web applications. We use cutting-edge technologies and best development practices. Each team member contributes to creating a high-quality product. Our specializations include: frontend, UX/UI design, and testing.',
    title_main: {
      rest: 'REST Client App',
      team: 'Our Team',
    },
    title1: 'WEB Developers of our team',
    title2:
      ' We may not have much experience, but we are wearing navy stripes!',
    tabs: {
      rest: 'Rest App',
      team: 'Team',
    },
    welcome: 'Welcome, ',
    links: {
      restclient: 'REST Client',
      history: 'History',
      variables: 'Variables',
    },
  },
  developers: {
    nikolay: {
      name: 'Nikolay',
      task1: 'REST page',
      task2: 'Client page',
      description: "i'm the best",
    },
    anastasiya: {
      name: 'Anastasiya',
      task1: 'History page',
      task2: 'Variables page',
      description: "i'm the best too",
    },
    yuliya: {
      name: 'Julia',
      task1: 'Welcome page',
      task2: 'Localization',
      task3: 'Authorization',
      task4: 'Main route',
      description:
        'Hello, my name is Yuliya. I am a self-taught front-end developer. I primarily focus on writing clean, elegant, and efficient code. I am proficient in HTML, CSS, SCSS, JavaScript, React and Type Script. And I get real pleasure from the results of my work.',
    },
  },
};

describe('WelcomePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  test('renders welcome page', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WelcomePage />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Rest App')).toBeTruthy();
    expect(screen.getByText('WEB Developers of our team')).toBeTruthy();
  });

  test('changes tabs correctly', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <WelcomePage />
      </NextIntlClientProvider>
    );

    const teamTab = screen.getByText('Team');
    fireEvent.click(teamTab);
    await waitFor(() => {
      expect(screen.getByText('Our Team')).toBeTruthy();
      expect(
        screen.getByText(
          'Our team consists of experienced developers specializing in modern web applications. We use cutting-edge technologies and best development practices. Each team member contributes to creating a high-quality product. Our specializations include: frontend, UX/UI design, and testing.'
        )
      ).toBeTruthy();
    });
  });
});
