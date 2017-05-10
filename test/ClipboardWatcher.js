const test = require('ava')
const ClipboardWatcher = require('../lib/ClipboardWatcher')

test.beforeEach(t => {
  const bufferSize = 5
  t.context.clipboardWatcher = new ClipboardWatcher({ bufferSize })
})

test('getEntries', t => {
  const initEntries = [1, 2, 3, 4, 5]
  t.context.clipboardWatcher._buffer.setArray(initEntries)

  t.deepEqual(
    t.context.clipboardWatcher.getEntries(), [5, 4, 3, 2, 1],
    'getEntries() with start index 0'
  )

  t.deepEqual(
    t.context.clipboardWatcher.getEntries(1), [4, 3, 2, 1, 5],
    'getEntries() with start index 1'
  )
})

test('getNextEntries', t => {
  const initEntries = [1, 2, 3, 4, 5]
  t.context.clipboardWatcher._buffer.setArray(initEntries)

  t.deepEqual(
    t.context.clipboardWatcher.getNextEntries(), [5, 4, 3, 2, 1],
    'getNextEntries() first time'
  )

  t.deepEqual(
    t.context.clipboardWatcher.getNextEntries(), [4, 3, 2, 1, 5],
    'getNextEntries() 2nd time'
  )
})

test('resetIndex', t => {
  const initEntries = [1, 2, 3, 4, 5]
  t.context.clipboardWatcher._buffer.setArray(initEntries)

  t.deepEqual(
    t.context.clipboardWatcher.getNextEntries(), [5, 4, 3, 2, 1],
    'getNextEntries() before resetIndex()'
  )

  t.context.clipboardWatcher.resetIndex()

  t.deepEqual(
    t.context.clipboardWatcher.getNextEntries(), [5, 4, 3, 2, 1],
    'getNextEntries() after resetIndex()'
  )
})
