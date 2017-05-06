const DEFAULT_SIZE = 10

module.exports = class {
  constructor ({ size } = { size: DEFAULT_SIZE }) {
    this._size = size
    this._arr = []
  }
  setArray (arr) {
    this._arr = [].concat(arr)
    if (this._arr.length > this._size) {
      this._arr.splice(this._size, this._arr.length - this._size)
    }
  }
  push (value) {
    this._arr.push(value)

    if (this._arr.length > this._size) {
      this._arr.splice(0, 1)
    }
  }
  read () {
    return this._arr[this._arr.length - 1]
  }
  readAll () {
    return [].concat(this._arr)
  }
  clear () {
    this._arr.splice(0, this._arr.length)
  }
  rotate () {
    const value = this._arr.pop()
    this._arr.unshift(value)
  }
}
