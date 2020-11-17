import React, {Component} from "react";
import "./App.css";
import "./reset.css";
import * as utils from "./utils.js";

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
      console.log("Video data loaded", list);
      const videos = [];
      for (const [_, value] of Object.entries(list)) {
        videos.push(value);
      }
      videos.sort(sortBy("firstAccessed", true));
      this.setState({ videos: videos });
    });
  }

  onVideoClicked(i) {
    this.setState({
      selectedIdx: i,
    })
  }

  render() {
    return (
      <React.Fragment>
        <MasterPanel
          selected={this.state.selectedIdx}
          videos={this.state.videos}
          onVideoClicked={(i) => this.onVideoClicked(i)}/>
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
  const videoViews = props.videos.map((video, i) =>
    <li
      key={video.id}
      className={"item master-item" + (i == props.selected ? " item-selected" : "")}
      onClick={() => props.onVideoClicked(i)}>
        {video.title}
    </li>
  );

  return (
    <div className="master">
      <div className="panel-header">
        <p>Videos</p>
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
      className="item detail-item">
      <a className="playback-timestamp" href={utils.buildUrl(props.video.id, bm.playbackTime)}>
        {utils.buildDisplayTimestamp(bm.playbackTime)}
      </a> {bm.note}
    </li>
  );

  const title = props.video ? props.video.title : "";
  const releaseDate = props.video ? '(' + props.video.releaseDate + ')' : "";

  return (
    <div className="detail">
      <div className="panel-header">
        <p>{title} {releaseDate}</p>
      </div>
      <ul>
        {bookmarkViews}
      </ul>
    </div>
  )
}

export default App;
