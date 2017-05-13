const RingBuffer = require('./RingBuffer')
const { clipboard } = require('electron')

const DEFAULT_INTERVAL_TIME = 2000
const DEFAULT_BUFFER_SIZE = 5
const INIT_BUFFER_INDEX = -1

module.exports = class ClipboardWatcher {
  constructor ({ intervalTime, bufferSize } = {
    intervalTime: DEFAULT_INTERVAL_TIME,
    bufferSize: DEFAULT_BUFFER_SIZE
  }) {
    this.intervalTime = intervalTime
    this._buffer = new RingBuffer({size: bufferSize})
    this._bufferIndex = INIT_BUFFER_INDEX
    this._interval = null
  }
  destroy () {
    this.stopPolling()
  }
  addEntry (entry) {
    this._buffer.push(entry)
  }
  hasSameEntry (newEntry) {
    return this._buffer.readAll().some(
      (entry) => { return entry === newEntry }
    )
  }
  getEntries (startIndex = 0) {
    const index = startIndex * -1
    return this._buffer.readAll(index).reverse()
  }
  getNextEntries () {
    this._bufferIndex += 1
    return this.getEntries(this._bufferIndex)
  }
  resetIndex () {
    this._bufferIndex = INIT_BUFFER_INDEX
  }
  writeFirstEntry () {
    const entry = this._buffer.read(this._bufferIndex)
    clipboard.writeText(String(entry))
  }
  startPolling () {
    this._interval = setInterval(() => {
      const entry = clipboard.readText()
      if (this.hasSameEntry(entry)) return

      this.addEntry(entry)
    }, this.intervalTime)
  }
  stopPolling () {
    clearInterval(this._interval)
  }
}
