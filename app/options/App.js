import React, {Component} from "react";
import "../common/reset.css";
import "./App.css";
import moment from "moment";
import * as utils from "../common/utils.js";

const roamDateFormat = 'MMMM Do, YYYY';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      selectedIdx: 0,
    };
  }

  componentDidMount() {
    chrome.storage.local.get(null, (list) => {
      const videos = [];
      for (const [_, value] of Object.entries(list)) {
        videos.push(value);
      }
      videos.sort(sortBy("firstAccessed", false));
      this.setState({ videos: videos });
    });
  }

  onVideoClicked(i) {
    this.setState({
      selectedIdx: i,
    })
  }

  onVideoDeleted(i) {
    const video = this.state.videos[i];
    const videoId = video.id;

    if (!confirm(`Delete notes for: "${video.title}"?`)) {
      return;
    }

    chrome.storage.local.remove(videoId, () => {
      //recalculate the index, in case it has changed
      const videos = this.state.videos;
      var idx = this.state.videos.findIndex(video => {
        return video.id === videoId;
      })
      videos.splice(idx, 1);
      this.setState({
        videos: videos,
        selectedIdx: 0
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <MasterPanel
          selected={this.state.selectedIdx}
          videos={this.state.videos}
          onVideoClicked={(i) => this.onVideoClicked(i)}
          onVideoDeleted={(i) => this.onVideoDeleted(i)}
        />
        <DetailPanel video={this.state.videos[this.state.selectedIdx]}/>
      </React.Fragment>
    );
  }
}

function sortBy(property, asc) {
  return ((a, b) =>
      (a[property] > b[property]) ? (asc ? 1 : -1) :
        ((b[property] > a[property]) ? (asc ? -1 : 1) : 0)
  )
}

function MasterPanel(props) {
  const videoViews = props.videos.map((video, i) => {
    const sel = i == props.selected;
    return (
      <li className={"master-item" + (sel ? " item-selected" : "")}
        key={video.id}
        onClick={() => props.onVideoClicked(i)}>
        {sel ? <div className="spacer"/> : ""}
        <p className={"title"}>{video.title}</p>
        <button
          onClick={() => props.onVideoDeleted(i)}
          className={"delete-btn"} type="button">Delete</button>
      </li>
    );
  });

  return (
    <div className="master">
      <div className="panel-header">
        <p className="title">TubeMark Library</p>
        <p className="subtitle">Sorted by first-accessed time</p>
      </div>
      <ul>
        {videoViews}
      </ul>
    </div>
  );
}

function DetailPanel(props) {
  const bookmarks = props.video ?
    props.video.bookmarks.sort(sortBy("playbackTime", true)) : [];

  const bookmarkViews = bookmarks.map((bm) =>
    <li
      key={bm.id}
      className="detail-item">
      <a className="playback-timestamp" href={utils.buildUrl(props.video.id, bm.playbackTime)}>
        {utils.buildDisplayTimestamp(bm.playbackTime)}
      </a> {bm.note}
    </li>
  );

  const title = props.video ? props.video.title : "No videos";
  const releaseDate = props.video ? props.video.releaseDate : "";
  const firstAccessed = props.video ? props.video.firstAccessed : "";

  return (
    <div className="detail">
      <VideoTitle
        className="panel-header"
        title={title}
        releaseDate={releaseDate}
        firstAccessed={firstAccessed}
      />
      <ul>
        {bookmarkViews}
      </ul>
    </div>
  )
}

function VideoTitle(props) {
  const releaseDate = moment(props.releaseDate).format(roamDateFormat);
  const firstAccessed = moment(props.firstAccessed).format(roamDateFormat);
  return (
    <div className={props.className}>
      <p className="title">{props.title}</p>
      <p className="subtitle">Released: {releaseDate} | First accessed: {firstAccessed}</p>
    </div>
  )
}

export default App;
