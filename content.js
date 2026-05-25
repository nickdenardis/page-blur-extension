// ABOUTME: Content script injected into every page.
// ABOUTME: Applies the CSS blur filter and responds to blur update messages.

chrome.runtime.sendMessage({ type: 'getBlur' }, (response) => {
  if (chrome.runtime.lastError) return;
  if (response && response.blur > 0) {
    document.documentElement.style.filter = `blur(${response.blur}px)`;
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'setBlur') {
    document.documentElement.style.filter =
      message.blur > 0 ? `blur(${message.blur}px)` : '';
  }
});
