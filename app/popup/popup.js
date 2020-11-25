import "../common/reset.css";
import "./popup.css";
import moment from "moment";
import * as utils from "../common/utils.js";

let video = {
  id: "",
  title: "",
  releaseDate: "",
  firstAccessed: "", //TODO could save this whenever we figure out the URL reload
  bookmarks: []
};

let playbackTime = -1;
let playbackTimeInput = document.getElementById("playbackTime");

let noteInput = document.getElementById("noteInput");
noteInput.addEventListener('keydown', function(e) {
	if(e.keyCode == 13 && e.metaKey) {
		saveBookmark();
	}
});

document.getElementById("saveBtn").onclick = saveBookmark;

window.onmessage = function(event) {
  switch (event?.data?.type) {
    case "CLOSE_POPUP":
      playbackTimeInput.innerHTML = "";
      noteInput.value = "";
      break;
    case "OPEN_POPUP":
      preparePopup(event.data);
      break;
  }
};

function preparePopup(newVideo) {
  noteInput.focus();
  playbackTime = Math.round(newVideo.playbackTime);
  playbackTimeInput.innerHTML = utils.buildDisplayTimestamp(playbackTime);

  chrome.storage.local.get([newVideo.id], function(result) {
    if (result && result[newVideo.id]) {
      video = result[newVideo.id];
    } else {
      video.id = newVideo.id;
      video.title = newVideo.title;
      video.firstAccessed = newVideo.firstAccessed;
      //TODO - handle different date formats - check locales, allow user to set it themselves?
      video.releaseDate = moment(newVideo.releaseDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
      video.bookmarks = [];
    }
  });
}

function saveBookmark() {
  if (noteInput.value === "") {
    return;
  }
  video.bookmarks.push({
    id: utils.uuidv4(),
    createdTime: new Date().toISOString(),
    playbackTime: parseInt(playbackTime),
    note: noteInput.value
  });

  let saveObject = {};
  saveObject[video.id] = video;

  chrome.storage.local.set(saveObject, function() {
    noteInput.value = "";
    playbackTimeInput.innerHTML = "";
    window.parent.postMessage({ type: "ON_SAVED" }, "*");
  });
}
