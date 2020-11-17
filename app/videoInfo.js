window.addEventListener("message", function(event) {
  if (event.data && event.data.type == "REQUEST_INFO") {
    window.postMessage({
      type: "CUR_VIDEO_INFO",
      args: {
          title : document.getElementsByClassName("ytp-title-link yt-uix-sessionlink")[0].innerText,
          playbackTime: document.getElementsByClassName("video-stream")[0].getCurrentTime(),
          releaseDate: document.getElementById("date").getElementsByTagName("yt-formatted-string")[0].innerText,
      }}, "*");
    }
  }, false
);
