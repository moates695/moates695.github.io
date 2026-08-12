// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// jsdom does not provide TextEncoder/TextDecoder, which react-router v7 needs at
// import time. Browsers have had both for years; this is a gap in the test
// environment, not a polyfill the site ships.
if (typeof global.TextEncoder === 'undefined') {
  Object.assign(global, { TextEncoder, TextDecoder });
}

// jsdom has no layout, so it throws "Not implemented" for scrollTo. App.tsx
// calls it on every route change, which buries real failures under stack
// traces. Same reasoning as above: a gap in the environment, not the site.
window.scrollTo = () => {};

// jsdom also ships no matchMedia, which MUI's useMediaQuery and the
// prefers-reduced-motion checks both call. Reporting "no match" renders the
// desktop layout with animations disabled, which is the calmer default to
// assert against.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
}
