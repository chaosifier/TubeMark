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
