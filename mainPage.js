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

var video_ids = [];
let storedCurrentVideoInfo = {
  title: "",
  tubeMarks: []
};

window.onmessage = function(e) {
  storedCurrentVideoInfo.title = e.data.title;
  videoInfo = e.data;
  console.log("videoinfo", videoInfo);
  document.getElementById("videoTitle").innerHTML = e.data.title;
  document.getElementById("inputTime").value = e.data.playbackTime;

  chrome.storage.sync.get(["video_ids"], function(result) {
    console.log("video_ids " + JSON.stringify(result));
    video_ids = result.video_ids;
  });

  chrome.storage.sync.get([videoInfo.id], function(result) {
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
  if (!video_ids || video_ids.indexOf(videoInfo.id) == -1) {
    if (!video_ids) video_ids = [];

    video_ids.push(videoInfo.id);
    var keyValue = {};
    keyValue["video_ids"] = video_ids;
    chrome.storage.sync.set(keyValue, function() {
      console.log("New video_Id saved to video_id array.");
    });
  }

  // treat playbackTime as the primary key
  storedCurrentVideoInfo.tubeMarks.push({
    playbackTime: videoInfo.playbackTime,
    title: document.getElementById("inputTitle").value,
    description: document.getElementById("textAreaNote").value
  });
  var keyValue = {};
  keyValue[videoInfo.id] = storedCurrentVideoInfo;
  chrome.storage.sync.set(keyValue, function() {
    console.log("saved value", JSON.stringify(keyValue));
    addNewTimelineAccrodion({
      id: videoInfo.id,
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

  // parent.document.getElementsByClassName("video-stream")[0].currentTime = $(
  //   this
  // ).attr("time");
});

function addNewTimelineAccrodion(info) {
  var accordianDiv = `
    <div class="card">
        <div class="card-header p-0" id="video_id_heading">
            <span class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#video_id_accor" aria-expanded="true" aria-controls="video_id_1_accor">
                    {title}
                </button>
            </span>
            <div class="float-right p-2">
            <button class="time-link" time="{playback_time}">{time}<span>
            </div>
        </div>

        <div id="video_id_accor" class="collapse" aria-labelledby="video_id_heading" data-parent="#timeLineAccordion">
            <div class="card-body">
                {description}
            </div>
            <button class="btn-info float-right btn-md m-1" id="btnEdit">Edit</button>
            <button class="btn-danger float-right btn-md m-1" id="btnDelete">Delete</button>
        </div>
    </div>
    `;

  accordianDiv = accordianDiv.replace("video_id", info.id);
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
    curTM.id = storedCurrentVideoInfo.id;
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
