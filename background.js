chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options.html' });
});
