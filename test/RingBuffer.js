const test = require('ava')
const RingBuffer = require('../lib/RingBuffer')

test.beforeEach(t => {
  t.context.ringBuffer = new RingBuffer({size: 5})
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
  t.context.ringBuffer.push(1)
  t.context.ringBuffer.push(2)
  t.is(t.context.ringBuffer.read(), 2, 'read last value')

  t.context.ringBuffer.push(3)
  t.context.ringBuffer.push(4)
  t.context.ringBuffer.push(5)
  t.context.ringBuffer.push(6)
  t.deepEqual(
    t.context.ringBuffer.readAll(), [2, 3, 4, 5, 6],
    'read all'
  )

  t.true(
    t.context.ringBuffer !== t.context.ringBuffer.readAll(),
    'readAll() return copy of ringBuffer._arr')
})

test('clear', t => {
  t.context.ringBuffer.push(1)
  t.context.ringBuffer.push(2)
  t.notDeepEqual(t.context.ringBuffer._arr, [], 'before clear()')

  t.context.ringBuffer.clear()
  t.deepEqual(t.context.ringBuffer._arr, [], 'after clear()')
})

test('rotate', t => {
  t.context.ringBuffer.push(1)
  t.context.ringBuffer.push(2)
  t.context.ringBuffer.push(3)
  t.context.ringBuffer.rotate()

  t.deepEqual(t.context.ringBuffer._arr, [3, 1, 2], 'rotate()')
})
