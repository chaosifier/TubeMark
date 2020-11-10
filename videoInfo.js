window.addEventListener("message", function(event) {
  console.log("Receieved message: ", event);
  if (event.data && event.data.type == "REQUEST_INFO") {
    window.postMessage({
      type: "CUR_VIDEO_INFO",
      args: {
          title : document.getElementsByClassName("ytp-title-link yt-uix-sessionlink")[0].innerText,
          url : document.getElementsByClassName("ytp-title-link yt-uix-sessionlink")[0].href,
          playbackTime: document.getElementsByClassName("video-stream")[0].getCurrentTime()
      }}, "*");
    }
  }, false
);
