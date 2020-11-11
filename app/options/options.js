import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
ReactDOM.render(<App />, document.getElementById("app"));


document.addEventListener("DOMContentLoaded", function() {
  console.log("Options page loaded");
  chrome.storage.local.get(null, function(keys) {
    chrome.storage.local.get(keys, function(list) {
      console.log(list);
    });
  });
});
