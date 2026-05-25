chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'getBlur') return false;

  const tabId = sender.tab?.id;
  if (tabId == null) {
    sendResponse({ blur: 0 });
    return true;
  }

  chrome.storage.session.get(`blur_${tabId}`, (data) => {
    sendResponse({ blur: data[`blur_${tabId}`] ?? 0 });
  });

  return true; // Keep message channel open for async sendResponse
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`blur_${tabId}`);
});
