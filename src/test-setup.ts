import '@testing-library/jest-dom';
import { vi } from 'vitest';

// framer-motion renders animated wrappers that break tests when IntersectionObserver
// is absent. Replace every motion.X with a plain passthrough and AnimatePresence
// with a fragment so test output matches real DOM structure.
vi.mock('framer-motion', () => {
  const React = require('react');
  const ANIMATION_PROPS = new Set([
    'initial', 'animate', 'exit', 'whileInView', 'whileHover',
    'whileTap', 'viewport', 'transition', 'variants', 'layout', 'layoutId',
  ]);

  // Cache component functions so that motion.div always returns the *same*
  // reference. A new function on every get() access would make React think the
  // component type changed and unmount/remount the subtree on every render,
  // destroying controlled-input state (email, etc.).
  const cache: Record<string, React.FC> = {};
  const motion = new Proxy({} as Record<string, React.FC>, {
    get: (_target, tag: string) => {
      if (!cache[tag]) {
        cache[tag] = ({ children, ...props }: Record<string, unknown>) => {
          const safe = Object.fromEntries(
            Object.entries(props).filter(([k]) => !ANIMATION_PROPS.has(k))
          );
          return React.createElement(tag, safe, children);
        };
        // Give each generated component a display name for easier debugging
        Object.defineProperty(cache[tag], 'name', { value: `motion.${tag}` });
      }
      return cache[tag];
    },
  });

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => true,
  };
});

// jsdom does not implement IntersectionObserver or ResizeObserver
class StubObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: StubObserver });
Object.defineProperty(window, 'ResizeObserver', { writable: true, value: StubObserver });

// scrollIntoView is a no-op in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();
