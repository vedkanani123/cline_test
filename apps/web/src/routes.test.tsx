import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { PAGES } from './catalog';

/**
 * A sweep over every destination in the catalog.
 *
 * The point is not to test styling — it is to guarantee that no route in the
 * sidebar is a dead end, and that nothing logs a React warning while doing it.
 */

let consoleError: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
});

function renderAt(path: string) {
  window.history.replaceState({}, '', path);
  return render(<App />);
}

function expectNoReactWarnings() {
  expect(consoleError.mock.calls.map((call) => String(call[0])).join('\n')).toBe('');
}

describe('public routes', () => {
  it('renders the landing page', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create your demo plan/i })).toBeInTheDocument();
    expectNoReactWarnings();
  });

  it('renders the demo log in', () => {
    renderAt('/login');
    expect(screen.getByRole('heading', { name: /come on in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expectNoReactWarnings();
  });

  it('renders demo registration with a name field', () => {
    renderAt('/register');
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create my demo plan/i })).toBeInTheDocument();
    expectNoReactWarnings();
  });

  it('shows a recoverable page for an unknown path', () => {
    renderAt('/definitely-not-a-page');
    expect(screen.getByRole('heading', { name: /couldn’t find that page/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument();
    expectNoReactWarnings();
  });
});

describe('every catalog destination', () => {
  it.each(PAGES.map((page) => [page.path, page.label] as const))(
    '%s renders “%s” as a real screen',
    (path, label) => {
      const { container } = renderAt(path);

      // 1. The screen body rendered (every workspace uses the shared .page layout).
      expect(container.querySelector('.page')).not.toBeNull();

      // 2. The shell knows where we are: the label appears in the nav and the breadcrumb.
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);

      // 3. The current page is marked for assistive technology.
      expect(container.querySelector('[aria-current="page"]')).not.toBeNull();

      // 4. The active nav link points at this route.
      const active = container.querySelector('.shell__nav-link.is-active');
      expect(active?.getAttribute('href')).toBe(path);

      expectNoReactWarnings();
    },
  );
});

describe('navigation', () => {
  it('moves between workspaces without a full reload', async () => {
    const user = userEvent.setup();
    renderAt('/app');

    const nav = screen.getByRole('navigation', { name: 'Workspaces' });
    await user.click(within(nav).getByRole('link', { name: 'Food diary' }));

    expect(window.location.pathname).toBe('/app/food/diary');
    expect(screen.getAllByText('Food diary').length).toBeGreaterThan(0);
    expectNoReactWarnings();
  });

  it('filters the sidebar by search terms', async () => {
    const user = userEvent.setup();
    renderAt('/app');

    await user.type(screen.getByLabelText(/search app pages/i), 'yoga');

    const nav = screen.getByRole('navigation', { name: 'Workspaces' });
    expect(within(nav).getByRole('link', { name: 'Yoga & mobility' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Groceries' })).toBeNull();
    expectNoReactWarnings();
  });
});

describe('shared demo state', () => {
  it('carries a logged action from one workspace into another', async () => {
    const user = userEvent.setup();
    renderAt('/app');

    // Today starts with three demo glasses of water.
    expect(screen.getByRole('img', { name: /3 of 8 demo glasses/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /add a glass/i }));
    expect(screen.getByRole('img', { name: /4 of 8 demo glasses/i })).toBeInTheDocument();

    // Navigate away and back: the change is still there.
    const nav = screen.getByRole('navigation', { name: 'Workspaces' });
    await user.click(within(nav).getByRole('link', { name: 'Water' }));
    expect(window.location.pathname).toBe('/app/food/water');

    await user.click(within(nav).getByRole('link', { name: 'Overview' }));
    expect(screen.getByRole('img', { name: /4 of 8 demo glasses/i })).toBeInTheDocument();
    expectNoReactWarnings();
  });

  it('persists the demo name into the greeting', async () => {
    const user = userEvent.setup();
    renderAt('/register');

    await user.type(screen.getByLabelText(/first name/i), 'Priya');
    await user.type(screen.getByLabelText(/email address/i), 'priya@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /create my demo plan/i }));

    expect(window.location.pathname).toBe('/app');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/priya/i);
    expectNoReactWarnings();
  });
});
