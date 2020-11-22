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
      console.log("close popup");
      playbackTimeInput.innerHTML = "";
      noteInput.value = "";
      break;
    case "OPEN_POPUP":
      preparePopup(event.data);
      break;
  }
};

function preparePopup(newVideo) {
  console.log("Got request to open popup:", newVideo);
  noteInput.focus();
  playbackTime = Math.round(newVideo.playbackTime);
  playbackTimeInput.innerHTML = buildDisplayTimestamp(playbackTime);

  chrome.storage.local.get([newVideo.id], function(result) {
    if (result && result[newVideo.id]) {
      video = result[newVideo.id];
      console.log("retrieved current video info", video);
    } else {
      console.log("no video found, creating new one");
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
    id: uuidv4(),
    createdTime: new Date().toISOString(),
    playbackTime: parseInt(playbackTime),
    note: noteInput.value
  });

  let saveObject = {};
  saveObject[video.id] = video;

  console.log("saving video", saveObject);
  chrome.storage.local.set(saveObject, function() {
    console.log("Video (" + video.id + ") successfully saved");
    noteInput.value = "";
    playbackTimeInput.innerHTML = "";
    window.parent.postMessage({ type: "ON_SAVED" }, "*");
  });
}

//Take from:
// https://stackoverflow.com/a/2117523/1751834
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

//TODO merge with options/utils.js somehow
function buildDisplayTimestamp(seconds) {
  var hours   = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - (hours * 3600)) / 60);
  var seconds = seconds - (hours * 3600) - (minutes * 60);
  var time = "";

  if (hours != 0) {
    time = hours+":";
  }
  if (minutes != 0 || time !== "") {
    minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
    time += minutes+":";
  }
  if (time === "") {
    time = seconds+"s";
  }
  else {
    time += (seconds < 10) ? "0"+seconds : String(seconds);
  }
  return time;
}
