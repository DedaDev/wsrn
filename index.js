const puppeteer = require('puppeteer-core');
const EventEmiter = require('events');
const path = require('path');

class Client extends EventEmiter {
    /**
   * @param {Object} obj
   * @param {String} obj.chromePath
   * @param {Boolean} obj.continuous
   */
  constructor({ chromePath, continuous }) {
    super();
    if (!Client.instance) {
      this.chromePath = chromePath;
      this.continuous = continuous || false;
      this.init();
      Client.instance = this;
    }
    return Client.instance;
  }

  record() {
    if (this.page) this.page.evaluate((continuous) => startRecording(continuous), this.continuous);
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          '--window-size=0,0',
          '--enable-speech-input',
          '--window-position=0,0',
          '--enable-speech-dispatcher', // Needed for Linux?
          '--use-fake-ui-for-media-stream', // dissable mic popup
        ],
        executablePath: this.chromePath,
        ignoreDefaultArgs: '--mute-audio',
      });

      const [page] = await this.browser.pages();
      this.page = page;

      await page.exposeFunction('newTranscript', (e) => this.emit('data', e));
      await page.exposeFunction('newError', (e) => this.emit('error', e));
      await page.exposeFunction('newEnd', () => this.emit('end'));
      await page.exposeFunction('newStart', () => this.emit('start'));
      await page.exposeFunction('newReady', () => this.emit('ready'));
      await page.goto(`file:${path.join(__dirname, '/html/index.html')}`);
    } catch (err) {
      this.emit('error', err);
    }
  }
}


module.exports = Client;
