let video = {
  id: "",
  title: "",
  firstAccessed: "", //TODO could save this whenever we figure out the URL reload
  bookmarks: []
};

window.onmessage = function(e) {
  document.getElementById("inputTime").value =
    Math.max(Math.round(e.data.playbackTime) - 5, 0);

  chrome.storage.local.get([video.id], function(result) {
    if (result && result[video.id]) {
      video = result[video.id];
      console.log("retrieved current video info", video);
    } else {
      console.log("no video found, creating new one");
      video.id = e.data.id;
      video.title = e.data.title;
      video.firstAccessed = new Date().toISOString();
    }
  });
};

document.getElementById("btnSave").onclick = function() {
  var playbackTime = document.getElementById("inputTime").value;
  var note = document.getElementById("textAreaNote").value;

  video.bookmarks.push({
    playbackTime: playbackTime,
    note: note
  });

  let saveObject = {};
  saveObject[video.id] = video;

  console.log("saving video", saveObject);
  chrome.storage.local.set(saveObject, function() {
    console.log("Video (" + video.id + ") successfully saved");
  });
};
