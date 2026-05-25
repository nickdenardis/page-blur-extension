// ABOUTME: Tests for background.js — per-tab blur state management.
// ABOUTME: Verifies getBlur responses and tab cleanup on close.

import { describe, it, expect, beforeEach, vi } from 'vitest';

let messageListener;
let tabRemovedListener;

beforeEach(async () => {
  resetChromeMocks();

  chrome.runtime.onMessage.addListener.mockImplementation((fn) => {
    messageListener = fn;
  });
  chrome.tabs.onRemoved.addListener.mockImplementation((fn) => {
    tabRemovedListener = fn;
  });

  vi.resetModules();
  await import('../background.js');
});

describe('background — getBlur message', () => {
  it('registers a message listener on load', () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledOnce();
  });

  it('returns blur: 0 when no value is stored for the tab', async () => {
    const sendResponse = vi.fn();
    const keepOpen = messageListener(
      { type: 'getBlur' },
      { tab: { id: 42 } },
      sendResponse
    );

    // Allow the async storage.get to resolve
    await new Promise((r) => setTimeout(r, 0));

    expect(sendResponse).toHaveBeenCalledWith({ blur: 0 });
    expect(keepOpen).toBe(true);
  });

  it('returns the stored blur value for the tab', async () => {
    await chrome.storage.session.set({ blur_99: 7 });

    const sendResponse = vi.fn();
    messageListener({ type: 'getBlur' }, { tab: { id: 99 } }, sendResponse);
    await new Promise((r) => setTimeout(r, 0));

    expect(sendResponse).toHaveBeenCalledWith({ blur: 7 });
  });

  it('returns blur: 0 when sender has no tab (e.g. popup)', async () => {
    const sendResponse = vi.fn();
    messageListener({ type: 'getBlur' }, {}, sendResponse);
    await new Promise((r) => setTimeout(r, 0));

    expect(sendResponse).toHaveBeenCalledWith({ blur: 0 });
  });

  it('ignores unrecognised message types', async () => {
    const sendResponse = vi.fn();
    const keepOpen = messageListener(
      { type: 'somethingElse' },
      { tab: { id: 1 } },
      sendResponse
    );

    await new Promise((r) => setTimeout(r, 0));

    expect(sendResponse).not.toHaveBeenCalled();
    expect(keepOpen).toBeFalsy();
  });
});

describe('background — tab cleanup', () => {
  it('registers a tab removed listener on load', () => {
    expect(chrome.tabs.onRemoved.addListener).toHaveBeenCalledOnce();
  });

  it('removes the blur entry from storage when a tab closes', async () => {
    await chrome.storage.session.set({ blur_7: 5 });

    tabRemovedListener(7);
    await new Promise((r) => setTimeout(r, 0));

    expect(chrome.storage.session.remove).toHaveBeenCalledWith('blur_7');
  });
});
