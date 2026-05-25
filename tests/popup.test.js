// ABOUTME: Tests for popup.js — UI initialisation, slider interaction, and reset.
// ABOUTME: Sets up a minimal DOM and exercises the exported init() function.

import { describe, it, expect, beforeEach, vi } from 'vitest';

const SLIDER_HTML = `
  <input type="range" id="blur-slider" min="0" max="10" step="0.5" value="0">
  <button id="reset-btn">&#x2715;</button>
`;

function getSlider() { return document.getElementById('blur-slider'); }
function getResetBtn() { return document.getElementById('reset-btn'); }

let init;

beforeEach(async () => {
  resetChromeMocks();
  document.body.innerHTML = SLIDER_HTML;

  chrome.tabs.query.mockResolvedValue([{ id: 42 }]);

  vi.resetModules();
  ({ init } = await import('../popup.js'));
});

describe('popup — initialisation', () => {
  it('exports an init function', () => {
    expect(typeof init).toBe('function');
  });

  it('sets slider to 0 when no blur is stored for the tab', async () => {
    chrome.storage.session.get.mockResolvedValue({});
    await init();
    expect(getSlider().value).toBe('0');
  });

  it('restores the slider to a previously stored blur value', async () => {
    chrome.storage.session.get.mockResolvedValue({ blur_42: 6 });
    await init();
    expect(getSlider().value).toBe('6');
  });
});

describe('popup — slider interaction', () => {
  beforeEach(async () => {
    chrome.storage.session.get.mockResolvedValue({});
    await init();
  });

  it('saves to storage when the slider changes', async () => {
    getSlider().value = '5';
    getSlider().dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 0));

    expect(chrome.storage.session.set).toHaveBeenCalledWith({ blur_42: 5 });
  });

  it('sends setBlur message to the tab when the slider changes', async () => {
    getSlider().value = '5';
    getSlider().dispatchEvent(new Event('input'));
    await new Promise((r) => setTimeout(r, 0));

    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(42, {
      type: 'setBlur',
      blur: 5,
    });
  });
});

describe('popup — reset button', () => {
  beforeEach(async () => {
    chrome.storage.session.get.mockResolvedValue({ blur_42: 7 });
    await init();
  });

  it('resets slider to 0 when reset is clicked', async () => {
    getResetBtn().click();
    await new Promise((r) => setTimeout(r, 0));
    expect(getSlider().value).toBe('0');
  });

  it('saves 0 to storage when reset is clicked', async () => {
    getResetBtn().click();
    await new Promise((r) => setTimeout(r, 0));
    expect(chrome.storage.session.set).toHaveBeenCalledWith({ blur_42: 0 });
  });

  it('sends setBlur 0 message to the tab when reset is clicked', async () => {
    getResetBtn().click();
    await new Promise((r) => setTimeout(r, 0));
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(42, {
      type: 'setBlur',
      blur: 0,
    });
  });
});
