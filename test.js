const {test} = require('testpass')

const AsyncTaskGroup = require('.')

test('wrap function', (t) => {
  const p1 = defer()
  const p2 = defer().promise
  const wrap = () => p1.promise
  const tasks = new AsyncTaskGroup(3, wrap)
    .push(p2).push(p2).push(p2)

  t.eq(tasks.count, 3)
  p1.resolve()
  return tasks.then(() => {
    t.eq(tasks.count, 0)
  })
})

test('limit concurrency', (t) => {
  const p1 = defer()
  const p2 = defer()

  const tasks = new AsyncTaskGroup(1)
    .push(() => p1.promise)
    .push(() => p2.promise)

  t.eq(tasks.count, 1)
  t.eq(tasks.queue.length, 1)

  p1.resolve()
  setImmediate(() => {
    t.eq(tasks.count, 1)
    t.eq(tasks.queue.length, 0)
    p2.resolve()
  })

  return tasks.then(() => {
    t.eq(tasks.count, 0)
    t.eq(tasks.queue.length, 0)
  })
})

test('the promise is rejected if a task throws', (t) => {
  let task1 = t.spy()
  let task2 = t.spy()

  const error = new Error()
  const tasks = new AsyncTaskGroup(1)
    .push(() => {
      task1()
      throw error
    })
    .push(task2)

  return tasks.then(() => {
    if (task1.calls == 0) {
      t.fail('tasks functions were not called')
    } else if (task2.calls == 1) {
      t.fail('task group continued despite error')
    } else {
      t.fail('exception did not reject the group promise')
    }
  }, (e) => {
    if (e == error) {
      t.eq(tasks.error, error)
    } else {
      t.fail(e.message)
    }
  })
})

function defer() {
  const d = {}
  d.promise = new Promise(function(resolve, reject) {
    d.resolve = resolve
    d.reject = reject
  })
  return d
}
