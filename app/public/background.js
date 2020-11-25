chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options.html' });
});

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'ON_URL_CHANGE',
        url: changeInfo.url
      });
    }
  }
);

chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "ON_SHORTCUT_PRESSED" });
  });
});
