import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
ReactDOM.render(<App />, document.getElementById("app"));


document.addEventListener("DOMContentLoaded", function() {
  console.log("Options page loaded");
  chrome.storage.sync.get(null, function(items) {
    console.log(Object.keys(items));

    for (var key in items) {
      chrome.storage.sync.get(key, function(item) {
        console.log(item);
      });
    }
  });
});
