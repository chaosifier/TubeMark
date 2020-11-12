export function buildUrl(key, seconds) {
  const suffix = seconds ? '?t=' + seconds : ''
  return `https://youtu.be/${key}${suffix}`;
}

//Taken from:
//https://stackoverflow.com/a/7579799/1751834
export function buildDisplayTimestamp(seconds) {
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

//TEST DATA
export const testVideos = [
  {
    key: "uQhTuRlWMxw",
    title: "Joe Rogan Experience #1216 - Sir Roger Penrose",
    dateAccessed: new Date().toJSON(),
    bookmarks: [
      {
        playbackTimeSec: 72,
        label: "Something important at 1m12"
      }, {
        playbackTimeSec: 105,
        label: "Something important at 1m45"
      }, {
        playbackTimeSec: 696,
        label: "Something important at 11m36"
      }, {
        playbackTimeSec: 4526,
        label: "Blah blah blah"
      }, {
        playbackTimeSec: 9999,
        label: "Blah blah blah"
      }
    ]
  }, {
    key: "GEw0ePZUMHA",
    title: "Das Paradoxon der Ableitung | Kapitel 2, Essenz der Analysis",
    dateAccessed: new Date().toJSON(),
    bookmarks: [
      {
        playbackTimeSec: 4,
        label: "Something important at 4s"
      }, {
        playbackTimeSec: 25,
        label: "Something important at 25s"
      }
    ]
  }
]
