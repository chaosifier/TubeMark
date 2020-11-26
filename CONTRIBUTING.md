## Build locally
Ensure that you have [npm installed](https://www.npmjs.com/get-npm) on your system.

You should then be able to run:
```
npm run dev
```
which uses [webpack](https://webpack.js.org/) to build the various scripts necessary for the popup and the options page. You can then open the `src/public` as an "unpacked extension" in [chrome://extensions](chrome://extensions), as per the chrome extension developer guides.

## Brief Overview of the Architecture
There 3 main parts to this chrome extension:
1. The options page, built in React, which pulls all of the currently saved bookmarks out of chrome storage.
2. The popup, which is an iframe that sits on top of the current video and waits for the user to provide notes and click save. The note and playback timestamp are then saved to chrome storage to be picked up by the options page.
3. The content.js, background.js and videoInfo.js scripts, which set up the popup in the background, insert the TubeMark button in the video controls, watch for changes to the video (since youtube is a single-page application, we can't assume the video won't change from underneath us) and pass the timestamp to the popup at the point the TubeMark button is pressed.
