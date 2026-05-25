import { vi } from 'vitest';

const storageData = {};

const chromeMock = {
  storage: {
    session: {
      get: vi.fn((key, cb) => {
        const result = {};
        const keys = typeof key === 'string' ? [key] : key;
        for (const k of keys) {
          if (storageData[k] !== undefined) result[k] = storageData[k];
        }
        cb?.(result);
        return Promise.resolve(result);
      }),
      set: vi.fn((items, cb) => {
        Object.assign(storageData, items);
        cb?.();
        return Promise.resolve();
      }),
      remove: vi.fn((key, cb) => {
        const keys = typeof key === 'string' ? [key] : key;
        for (const k of keys) delete storageData[k];
        cb?.();
        return Promise.resolve();
      }),
    },
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
    onRemoved: { addListener: vi.fn() },
    onUpdated: { addListener: vi.fn() },
  },
  runtime: {
    onMessage: { addListener: vi.fn() },
    sendMessage: vi.fn(),
    lastError: null,
    getURL: vi.fn((path) => `chrome-extension://fake-id/${path}`),
  },
  action: {
    setIcon: vi.fn(),
  },
};

global.chrome = chromeMock;

// Expose a helper to reset storage and mocks between tests
global.resetChromeMocks = () => {
  for (const key of Object.keys(storageData)) delete storageData[key];
  vi.clearAllMocks();
};
