var videoInfo = {
  id: "",
  title: "",
  playbackTime: 0
};

var curTubeMark = {
  noteTitle: "",
  noteBody: "",
  playbackTime: 0
};

let storedCurrentVideoInfo = {
  title: "",
  tubeMarks: []
};

window.onmessage = function(e) {
  storedCurrentVideoInfo.title = e.data.title;
  videoInfo = e.data;
  console.log("videoinfo", videoInfo);
  document.getElementById("inputTime").value = e.data.playbackTime;

  chrome.storage.local.get([videoInfo.id], function(result) {
    if (result && result[videoInfo.id]) {
      storedCurrentVideoInfo = result[videoInfo.id];
      mapStoredVideoInfoToView(storedCurrentVideoInfo);
    }
    console.log(
      "retrieved current video info : " + JSON.stringify(storedCurrentVideoInfo)
    );
  });
};

var saveBtn = document.getElementById("btnSave");
saveBtn.onclick = function() {
  // treat playbackTime as the primary key
  var newTubemarkId = guid();
  storedCurrentVideoInfo.tubeMarks.push({
    id: newTubemarkId,
    playbackTime: videoInfo.playbackTime,
    title: document.getElementById("inputTitle").value,
    description: document.getElementById("textAreaNote").value
  });
  var keyValue = {};
  keyValue[videoInfo.id] = storedCurrentVideoInfo;
  chrome.storage.local.set(keyValue, function() {
    addNewTimelineAccrodion({
      id: newTubemarkId,
      playbackTime: videoInfo.playbackTime,
      title: document.getElementById("inputTitle").value,
      description: document.getElementById("textAreaNote").value
    });
  });
};

$(document).on("click", ".time-link", function() {
  parent.window.postMessage(
    {
      type: "SKIP_TO_TIME",
      time: $(this).attr("time")
    },
    "*"
  );
});

$(document).on("click", ".delete-tubemark", function() {
  var timeIdValue = $(this).attr("tm-id");
  var tmId = timeIdValue.replace("tm_", "");
  var indexOfItemToDelete = storedCurrentVideoInfo.tubeMarks.indexOf(
    storedCurrentVideoInfo.tubeMarks.filter(tm => tm.id == tmId)[0]
  );
  if (indexOfItemToDelete != -1) {
    storedCurrentVideoInfo.tubeMarks.splice(indexOfItemToDelete, 1);

    var keyValue = {};
    keyValue[videoInfo.id] = storedCurrentVideoInfo;
    chrome.storage.local.set(keyValue, function() {
      $("#" + timeIdValue + "_accrod").remove();
    });
  }
});

function addNewTimelineAccrodion(info) {
  var accordianDiv = `
    <div class="card" id="tm_{video_id}_accrod">
        <div class="card-header p-0" id="tm_{video_id}_heading" data-toggle="collapse" data-target="#tm_{video_id}_accor" aria-expanded="true" aria-controls="tm_{video_id}_accor">
            <span class="mb-0">
                <button class="btn btn-link" type="button">
                    {title}
                </button>
            </span>
            <div class="float-right p-2">
            <button class="time-link" time="{playback_time}">{time}</button>
            </div>
        </div>

        <div id="tm_{video_id}_accor" class="collapse" aria-labelledby="tm_{video_id}_heading" data-parent="#timeLineAccordion">
            <div class="card-body">
                {description}
            </div>
            <button class="delete-tubemark btn-danger float-right btn-md m-1" tm-id="tm_{video_id}">Delete</button>
        </div>
    </div>
    `;
  // treating time as id
  accordianDiv = accordianDiv.replace(new RegExp("{video_id}", "g"), info.id);
  accordianDiv = accordianDiv.replace("{title}", info.title);
  accordianDiv = accordianDiv.replace("{playback_time}", info.playbackTime);
  accordianDiv = accordianDiv.replace(
    "{time}",
    formatSeconds(info.playbackTime)
  );

  accordianDiv = accordianDiv.replace("{description}", info.description);
  $("#timeLineAccordion").append(accordianDiv);
}

function mapStoredVideoInfoToView(storedCurrentVideoInfo) {
  $("#timeLineAccordion").empty();
  document.getElementById("videoTitle").innerHTML =
    storedCurrentVideoInfo.title;
  for (var i = 0; i < storedCurrentVideoInfo.tubeMarks.length; i++) {
    var curTM = storedCurrentVideoInfo.tubeMarks[i];
    addNewTimelineAccrodion(curTM);
  }
}

function formatSeconds(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600) % 24;
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;
  return [hours, minutes, seconds]
    .map(v => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
