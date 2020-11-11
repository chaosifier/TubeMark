import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
ReactDOM.render(<App />, document.getElementById("app"));


document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get(null, function(items) {
    var allKeys = Object.keys(items);

    for (var item in items) {
      console.log(item);
    }
  });
});
