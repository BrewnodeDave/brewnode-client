// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';

// Mock console methods to avoid noise in tests
const originalWarn = console.warn;
global.console = {
  ...console,
  // Uncomment the following lines to suppress console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn().mockImplementation((...args) => {
    // Suppress React Router future flag warnings
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('React Router Future Flag Warning')
    ) {
      return;
    }
    // Let all other warnings through
    originalWarn.apply(console, args);
  }),
  error: jest.fn(),
};

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Set up ResizeObserver polyfill for tests
global.ResizeObserver = ResizeObserver;

// Mock performance.mark for compatibility across different Node.js versions
if (typeof performance === 'undefined') {
  global.performance = {
    mark: jest.fn(),
    measure: jest.fn(),
    now: jest.fn(() => Date.now()),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => [])
  };
} else if (!performance.mark) {
  performance.mark = jest.fn();
  performance.measure = jest.fn();
}

// Mock crypto for environments that don't have it
if (typeof crypto === 'undefined') {
  global.crypto = {
    getRandomValues: jest.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    randomUUID: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9))
  };
}

// Ensure TextEncoder/TextDecoder are available (needed for some tests)
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock CSS.supports for Highcharts compatibility
Object.defineProperty(window, 'CSS', {
  writable: true,
  value: {
    supports: jest.fn().mockReturnValue(true),
  },
});

// Mock global CSS if it doesn't exist
if (typeof global.CSS === 'undefined') {
  global.CSS = {
    supports: jest.fn().mockReturnValue(true),
  };
}

// Mock HTMLCanvasElement.getContext for chart components
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn().mockReturnValue({
    data: new Array(4).fill(0)
  }),
  putImageData: jest.fn(),
  createImageData: jest.fn().mockReturnValue([]),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn().mockReturnValue({ width: 0 }),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
});

// Mock localStorage if not already mocked in specific tests
if (!global.localStorage) {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  };
}

// Mock sessionStorage
global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock WebSocket for socket connections
global.WebSocket = jest.fn().mockImplementation(() => ({
  close: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}));
