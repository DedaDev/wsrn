# Web Speech Recognition in Node.js

WSRN communicate with a new browser instance over puppeteer core module, it uses default microphone settings for input.

[x] Windows
[x] Linux
[ ] MacOS (not tested)

## API

```js
const Wsrn = require('wsrn')

const client = new Wsrn({
    chromePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    continuous: true,
})

client.on('ready', () => {
  client.record();
});

client.on('data', (transcript) => {
  console.log(transcript);
});
```

Events also available:

* `error` - emitted when error occur
* `start` - when recording has started
* `end` when recording has ended

### Common Chrome paths

* Windows `C:/Program Files (x86)/Google/Chrome/Application/chrome.exe`
* Linux `/usr/bin/google-chrome-stable`
* MacOS `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`