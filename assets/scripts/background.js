let hidePanel = 'block';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ hidePanel });
});