const DEFAULT_SIZE = 5

module.exports = class {
  constructor ({ size }) {
    this._size = size || DEFAULT_SIZE
    this._arr = []
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
