const test = require('ava')
const RingBuffer = require('../lib/RingBuffer')

test.beforeEach(t => {
  t.context.ringBuffer = new RingBuffer({size: 5})
})

test('setArray', t => {
  const expectArray = [1, 2, 3, 4, 5]
  t.context.ringBuffer.setArray(expectArray)
  t.deepEqual(t.context.ringBuffer._arr, expectArray, 'setArray within size')

  t.context.ringBuffer.setArray([1, 2, 3, 4, 5, 6, 7])
  t.deepEqual(t.context.ringBuffer._arr, expectArray, 'setArray over size')
})

test('push one', t => {
  t.context.ringBuffer.push(1)
  t.deepEqual(t.context.ringBuffer._arr, [1], 'push one')
})

test('push multi', t => {
  t.context.ringBuffer.push(1)
  t.context.ringBuffer.push(2)
  t.context.ringBuffer.push(3)
  t.context.ringBuffer.push(4)
  t.context.ringBuffer.push(5)
  t.context.ringBuffer.push(6)
  t.deepEqual(
    t.context.ringBuffer._arr, [2, 3, 4, 5, 6],
    'push multi over buffer size'
  )
})

test('read', t => {
  t.context.ringBuffer.setArray([1, 2, 3])
  t.is(t.context.ringBuffer.read(), 1, 'read index 0')
  t.is(t.context.ringBuffer.read(1), 2, 'read index 1')
  t.is(t.context.ringBuffer.read(-1), 3, 'read index -1')
  t.is(t.context.ringBuffer.read(-2), 2, 'read index -2')
})

test('readAll', t => {
  t.context.ringBuffer.setArray([1, 2, 3, 4])
  t.true(
    t.context.ringBuffer !== t.context.ringBuffer.readAll(),
    'readAll() return copy of ringBuffer._arr')

  t.context.ringBuffer.push(5)
  t.context.ringBuffer.push(6)
  t.deepEqual(
    t.context.ringBuffer.readAll(), [2, 3, 4, 5, 6],
    'readAll with startIndex: 0'
  )

  t.deepEqual(
    t.context.ringBuffer.readAll(1), [3, 4, 5, 6, 2],
    'readAll with startIndex: 1'
  )
  t.deepEqual(
    t.context.ringBuffer.readAll(-1), [6, 2, 3, 4, 5],
    'readAll with startIndex: -1'
  )
})

test('clear', t => {
  t.context.ringBuffer.setArray([1, 2])
  t.notDeepEqual(t.context.ringBuffer._arr, [], 'before clear()')

  t.context.ringBuffer.clear()
  t.deepEqual(t.context.ringBuffer._arr, [], 'after clear()')
})
