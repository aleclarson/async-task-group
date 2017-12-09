
const {test} = require('testpass')

const AsyncTaskGroup = require('.')

test('limit concurrency', (t) => {
  const p1 = defer()
  const p2 = defer()

  const tasks = new AsyncTaskGroup(1)
    .push(() => p1.promise)
    .push(() => p2.promise)

  t.eq(tasks.numConcurrent, 1)
  t.eq(tasks.queue.length, 1)

  p1.resolve()
  setImmediate(() => {
    t.eq(tasks.numConcurrent, 1)
    t.eq(tasks.queue.length, 0)
    p2.resolve()
  })

  return tasks.then(() => {
    t.eq(tasks.numConcurrent, 0)
    t.eq(tasks.queue.length, 0)
  })
})

test('the promise is rejected if a task throws', (t) => {
  const error = new Error()
  const tasks = new AsyncTaskGroup()
    .push(() => {
      throw error
    })

  t.eq(tasks.error, error)
  return tasks.catch(err => t.eq(err, error))
})

function defer() {
  const d = {}
  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve
    d.reject = reject
  })
  return d
}
