// ABOUTME: Vitest configuration for Chrome extension unit tests.
// ABOUTME: Uses jsdom environment for DOM-dependent tests.

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
});
