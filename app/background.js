chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options/options.html' });
});
