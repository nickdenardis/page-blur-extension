export async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tab.id;

  const slider = document.getElementById('blur-slider');
  const resetBtn = document.getElementById('reset-btn');

  const stored = await chrome.storage.session.get(`blur_${tabId}`);
  slider.value = stored[`blur_${tabId}`] ?? 0;

  async function applyBlur(value) {
    await chrome.storage.session.set({ [`blur_${tabId}`]: value });
    chrome.tabs.sendMessage(tabId, { type: 'setBlur', blur: value });
  }

  slider.addEventListener('input', () => applyBlur(Number(slider.value)));
  resetBtn.addEventListener('click', () => {
    slider.value = 0;
    applyBlur(0);
  });
}
