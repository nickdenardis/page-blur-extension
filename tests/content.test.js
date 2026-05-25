import { describe, it, expect, beforeEach, vi } from 'vitest';

// content.js registers listeners at module load time, so we need to capture
// them via the chrome mock before importing.
let messageListener;

beforeEach(() => {
  resetChromeMocks();
  document.documentElement.style.filter = '';

  chrome.runtime.onMessage.addListener.mockImplementation((fn) => {
    messageListener = fn;
  });

  // Reset the module so listeners re-register fresh for each test
  vi.resetModules();
});

describe('content script — page load', () => {
  it('requests blur value from background on load', async () => {
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) => cb({ blur: 0 }));
    await import('../content.js');
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      { type: 'getBlur' },
      expect.any(Function)
    );
  });

  it('applies blur when background returns a non-zero value', async () => {
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) => cb({ blur: 6 }));
    await import('../content.js');
    expect(document.documentElement.style.filter).toBe('blur(6px)');
  });

  it('does not apply blur when background returns zero', async () => {
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) => cb({ blur: 0 }));
    await import('../content.js');
    expect(document.documentElement.style.filter).toBe('');
  });

  it('does not throw when runtime.lastError is set', async () => {
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) => {
      chrome.runtime.lastError = { message: 'Extension context invalidated.' };
      cb(undefined);
      chrome.runtime.lastError = null;
    });
    await expect(import('../content.js')).resolves.toBeDefined();
  });
});

describe('content script — message handling', () => {
  beforeEach(async () => {
    chrome.runtime.sendMessage.mockImplementation((_msg, cb) => cb({ blur: 0 }));
    await import('../content.js');
  });

  it('applies blur filter when setBlur message is received', () => {
    messageListener({ type: 'setBlur', blur: 4 });
    expect(document.documentElement.style.filter).toBe('blur(4px)');
  });

  it('removes blur filter when setBlur with zero is received', () => {
    document.documentElement.style.filter = 'blur(5px)';
    messageListener({ type: 'setBlur', blur: 0 });
    expect(document.documentElement.style.filter).toBe('');
  });

  it('ignores unrecognised message types', () => {
    document.documentElement.style.filter = 'blur(3px)';
    messageListener({ type: 'somethingElse' });
    expect(document.documentElement.style.filter).toBe('blur(3px)');
  });
});
