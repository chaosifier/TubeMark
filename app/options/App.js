import React, {Component} from "react";
import "./App.css";
import "./reset.css";
import * as utils from "./utils.js";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videos: utils.testVideos,
      selectedIdx: 0,
    };
  }

  componentDidMount() {
    chrome.storage.local.get(null, function(keys) {
      chrome.storage.local.get(keys, function(list) {
        console.log(list); //TODO set app state here!
      });
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

function MasterPanel(props) {
  const videoViews = props.videos.map((video, i) =>
    <li
      key={video.key}
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
  const bookmarkViews = props.video.bookmarks.map((bm) =>
    <li
      key={bm.playbackTimeSec}
      className="item detail-item">
      <a className="playback-timestamp" href={utils.buildUrl(props.video.key, bm.playbackTimeSec)}>
        {utils.buildDisplayTimestamp(bm.playbackTimeSec)}
      </a> {bm.label}
    </li>
  );

  return (
    <div className="detail">
      <div className="panel-header">
        <p>{props.video.title}</p>
      </div>
      <ul>
        {bookmarkViews}
      </ul>
    </div>
  )
}

export default App;
