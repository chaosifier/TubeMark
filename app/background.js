chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: 'options/options.html' });
});

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    console.log(changeInfo);
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'ON_URL_CHANGE',
        url: changeInfo.url
      })
    }
  }
);
