import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GROUPS, PAGE_COUNT, pageForPath, searchPages } from '../catalog';
import { Link, navigate, usePathname } from '../router';
import { Brand, DemoBadge } from '../components/Brand';
import { useDemo } from './demo';
import { useToast } from './toast';

/**
 * The dashboard shell: grouped navigation, page search, a mobile drawer and the
 * demo controls. Every catalog entry links to a real screen.
 */
export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const current = pageForPath(pathname);
  const { state, reset } = useDemo();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchPages(query), [query]);
  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({
        group,
        pages: group.pages.filter((page) => results.some((result) => result.id === page.id)),
      })).filter((entry) => entry.pages.length > 0),
    [results],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        setDrawerOpen(true);
      }
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
    setQuery('');
  }, [pathname]);

  const handleReset = () => {
    reset();
    toast('Demo data reset. You are back to the starting sample.');
  };

  const handleLeave = () => {
    navigate('/');
    toast('You left the demo. Sample data stays in this browser session only.', 'info');
  };

  return (
    <div className={`shell${drawerOpen ? ' shell--drawer' : ''}`}>
      <aside className="shell__sidebar" aria-label="All app pages">
        <div className="shell__sidebar-head">
          <Brand />
          <button type="button" className="shell__drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>

        <div className="nav-search">
          <input
            ref={searchRef}
            id="nav-search"
            type="search"
            value={query}
            placeholder="Search app pages"
            aria-label="Search app pages"
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="nav-search__hint" aria-hidden="true">⌘K</span>
        </div>

        <nav className="shell__nav" aria-label="Workspaces">
          {grouped.length === 0 ? (
            <p className="muted shell__nav-empty">No page matches “{query}”. Try “water”, “sleep” or “coach”.</p>
          ) : (
            grouped.map(({ group, pages }) => (
              <div key={group.id} className="shell__nav-group">
                <h2 className="shell__nav-title">
                  <span aria-hidden="true">{group.glyph}</span> {group.label}
                </h2>
                <ul>
                  {pages.map((page) => {
                    const active = page.id === current?.id;
                    return (
                      <li key={page.id}>
                        <Link
                          to={page.path}
                          className={`shell__nav-link${active ? ' is-active' : ''}`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {page.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </nav>

        <div className="shell__sidebar-foot">
          <p className="shell__promo">Need a little guidance?</p>
          <p className="muted">Ask the demo coach for a next step.</p>
          <Link to="/app/coach/chat" className="button button--ghost button--small">
            Open Coach
          </Link>
          <div className="shell__who">
            <span className="avatar" aria-hidden="true">
              {state.name.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{state.name}</strong>
              <span className="muted"> Demo space</span>
            </span>
          </div>
          <button type="button" className="link-button" onClick={handleLeave}>
            Leave demo
          </button>
        </div>
      </aside>

      {drawerOpen ? (
        <button type="button" className="shell__scrim" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
      ) : null}

      <div className="shell__main">
        <header className="shell__topbar">
          <button type="button" className="shell__drawer-open" onClick={() => setDrawerOpen(true)} aria-label="Open all pages">
            ☰
          </button>
          <p className="shell__crumb">
            {current ? (
              <>
                <span className="muted">{GROUPS.find((group) => group.id === current.group)?.label}</span>
                <span className="shell__crumb-sep" aria-hidden="true">
                  /
                </span>
                <span>{current.label}</span>
              </>
            ) : (
              <span>Today</span>
            )}
          </p>
          <DemoBadge />
          <div className="shell__topbar-actions">
            <button type="button" className="button button--ghost button--small" onClick={handleReset}>
              Reset demo
            </button>
            <button
              type="button"
              className="button button--ghost button--small"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {state.name} ▾
            </button>
          </div>
          {menuOpen ? (
            <div className="profile-menu" role="menu">
              <Link to="/app/account/profile" role="menuitem">Profile</Link>
              <Link to="/app/account/reminders" role="menuitem">Reminders</Link>
              <Link to="/app/account/privacy" role="menuitem">Privacy &amp; data</Link>
              <Link to="/app/account/settings" role="menuitem">Settings</Link>
              <button type="button" role="menuitem" onClick={handleReset}>Reset demo data</button>
              <button type="button" role="menuitem" onClick={handleLeave}>Leave demo</button>
            </div>
          ) : null}
        </header>

        <main className="shell__content" id="main">{children}</main>

        <footer className="shell__foot">
          <p className="muted">
            Frontend demo · {PAGE_COUNT} destinations · sample data stored only in this browser session.
          </p>
        </footer>
      </div>

      <nav className="shell__tabbar" aria-label="Main workspaces">
        <Link to="/app">Today</Link>
        <Link to="/app/food/diary">Food</Link>
        <Link to="/app/move/workouts">Move</Link>
        <Link to="/app/progress/insights">Progress</Link>
        <Link to="/app/coach/chat">Coach</Link>
      </nav>
    </div>
  );
}
