import { useCallback, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/**
 * A deliberately tiny client-side router.
 *
 * The demo has ~40 destinations and no server rendering, so a dependency-free
 * history router keeps the bundle small and the behaviour obvious.
 */

function readLocation(): { pathname: string; hash: string } {
  return { pathname: window.location.pathname, hash: window.location.hash };
}

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function navigate(to: string, options: { replace?: boolean } = {}) {
  const [rawPath, rawHash] = to.split('#');
  const path = rawPath === '' ? window.location.pathname : rawPath;
  const next = rawHash ? `${path}#${rawHash}` : path;

  if (options.replace) window.history.replaceState({}, '', next);
  else window.history.pushState({}, '', next);

  if (rawHash) {
    const target = document.getElementById(rawHash);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      emit();
      return;
    }
  }

  window.scrollTo(0, 0);
  emit();
}

/** Subscribe to location changes. Returns `{ pathname, hash }`. */
export function useLocation() {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const update = () => setLocation(readLocation());
    listeners.add(update);
    window.addEventListener('popstate', update);
    return () => {
      listeners.delete(update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  return location;
}

export function usePathname(): string {
  return useLocation().pathname;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link that keeps browser semantics (new tab, middle click, etc.). */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(to) || to.startsWith('//')) return;
      event.preventDefault();
      navigate(to);
    },
    [onClick, to],
  );

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
