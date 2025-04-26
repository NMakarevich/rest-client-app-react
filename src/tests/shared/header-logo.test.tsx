import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HeaderLogo } from '@/components/shared/header/header-logo';

vi.mock('next-intl/navigation', () => ({
  createNavigation: vi.fn(() => ({
    Link: vi.fn(),
  })),
}));

describe('Header Logo', () => {
  it('should render correctly', () => {
    const { container } = render(<HeaderLogo />);
    expect(container).toBeDefined();
  });
});
