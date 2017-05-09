const DEFAULT_SIZE = 10

module.exports = class {
  constructor ({ size } = { size: DEFAULT_SIZE }) {
    this._maxSize = size
    this._arr = []
  }
  get length () {
    return this._arr.length
  }
  setArray (arr) {
    this._arr = [].concat(arr)
    if (this._arr.length > this._maxSize) {
      this._arr.splice(this._maxSize, this._arr.length - this._maxSize)
    }
  }
  push (value) {
    this._arr.push(value)

    if (this._arr.length > this._maxSize) {
      this._arr.splice(0, 1)
    }
  }
  read (index = 0) {
    const i = (this.length + index) % this.length
    return this._arr[i]
  }
  readAll (startIndex = 0) {
    const indexSequence = Array.from({length: 5}, (_v, i) => startIndex + i)
    return indexSequence.map((i) => this.read(i))
  }
  clear () {
    this._arr.splice(0, this._arr.length)
  }
}
