const RingBuffer = require('./RingBuffer')
const EventEmitter = require('events')
const { clipboard } = require('electron')

const DEFAULT_INTERVAL_TIME = 2000
const ADD_ENTRY_EVENT = 'add-entry'

module.exports = class ClipboardWatcher {
  constructor ({ intervalTime } = { intervalTime: DEFAULT_INTERVAL_TIME }) {
    this.intervalTime = intervalTime
    this._buffer = new RingBuffer({size: 3})
    this._emitter = new EventEmitter()
    this._interval = null
  }
  destroy () {
    this._emitter.removeAllListeners()
    this.stopPolling()
  }
  hasSameEntry (newEntry) {
    return this._buffer.readAll().some(
      (entry) => { return entry === newEntry }
    )
  }
  getEntries () {
    return this._buffer.readAll()
  }
  getNextEntries () {
    this._buffer.rotate()
    return this._buffer.readAll()
  }
  writeFirstEntrie () {
    clipboard.writeText(this._buffer.read())
  }
  addEntry (entry) {
    this._buffer.push(entry)
    this._emitter.emit(ADD_ENTRY_EVENT, entry)
  }
  startPolling () {
    this._interval = setInterval(() => {
      const entry = clipboard.readText()
      if (this.hasSameEntry(entry)) return

      this.addEntry(entry)
    }, this.intervalTime)
  }
  stopPolling () {
    clearInterval(this.interval)
  }
  onAddEntry (callback) {
    this.emitter.on(ADD_ENTRY_EVENT, callback)
  }
}
