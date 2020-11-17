let video = {
  id: "",
  title: "",
  releaseDate: "",
  firstAccessed: "", //TODO could save this whenever we figure out the URL reload
  bookmarks: []
};

let textArea = document.getElementById("textAreaNote");
let timeInput = document.getElementById("inputTime");

window.onmessage = function(event) {
  switch (event?.data?.type) {
    case "CLOSE_POPUP":
      console.log("close popup");
      timeInput.value = "";
      textArea.value = "";
      break;
    case "OPEN_POPUP":
      preparePopup(event.data);
      break;
  }
};

function preparePopup(newVideo) {
  console.log("Got request to open popup:", newVideo);
  document.getElementById("inputTime").value =
    Math.max(Math.round(newVideo.playbackTime) - 5, 0);

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

document.getElementById("btnSave").onclick = function() {
  video.bookmarks.push({
    id: uuidv4(),
    createdTime: new Date().toISOString(),
    playbackTime: inputTime.value,
    note: textArea.value
  });

  let saveObject = {};
  saveObject[video.id] = video;

  console.log("saving video", saveObject);
  chrome.storage.local.set(saveObject, function() {
    console.log("Video (" + video.id + ") successfully saved");
    textArea.value = "";
    timeInput.value = "";
    window.parent.postMessage({
      type: "ON_SAVED"
    }, "*");
  });
};

//Take from:
// https://stackoverflow.com/a/2117523/1751834
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
