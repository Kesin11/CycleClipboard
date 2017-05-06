const RingBuffer = require('./RingBuffer')
const EventEmitter = require('events')
const { clipboard } = require('electron')

const DEFAULT_INTERVAL_TIME = 2000
const ADD_ENTRY_EVENT = 'add-entry'

module.exports = class ClipboardWatcher {
  constructor ({ intervalTime } = { intervalTime: DEFAULT_INTERVAL_TIME }) {
    this.buffer = new RingBuffer({size: 3})
    this.emitter = new EventEmitter()
    this.intervalTime = intervalTime
    this.interval = null
  }
  destroy () {
    this.emitter.removeAllListeners()
    this.stopPolling()
  }
  hasSameEntry (newEntry) {
    return this.buffer.readAll().some(
      (entry) => { return entry === newEntry }
    )
  }
  getEntries () {
    return this.buffer.readAll()
  }
  getNextEntries () {
    this.buffer.rotate()
    return this.buffer.readAll()
  }
  writeFirstEntrie () {
    clipboard.writeText(this.buffer.read())
  }
  addEntry (entry) {
    this.buffer.push(entry)
    this.emitter.emit(ADD_ENTRY_EVENT, entry)
  }
  startPolling () {
    this.interval = setInterval(() => {
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
