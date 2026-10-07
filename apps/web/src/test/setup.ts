import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement these; the router calls them on navigation.
Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
// jsdom does not implement scrollIntoView, and the router calls it on hash links.
// oxlint-disable-next-line no-extend-native -- shimming a missing jsdom API in tests only
Object.defineProperty(Element.prototype, 'scrollIntoView', { value: vi.fn(), writable: true });

beforeEach(() => {
  window.sessionStorage.clear();
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  cleanup();
});
