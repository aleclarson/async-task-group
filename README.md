
# async-task-group v1.1.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

> `npm install async-task-group`

The `AsyncTaskGroup` class is like `Promise.all`, but more flexible.

Tasks can be added any time before completion, which means tasks can easily extend the lifetime of an `AsyncTaskGroup` by adding more tasks.

The number of concurrent tasks can be limited or unlimited. When limited, any remaining tasks are not processed if a preceding task throws an error.

"Tasks" can be any value type. "Task functions" are called automatically. "Task promises" are awaited. If you pass a "wrap function" to the constructor, all task values will be passed to it. Typically, your wrap function should return a promise, but any value type is acceptable. Any functions returned by your wrap function are *not* called automatically.

```js
const AsyncTaskGroup = require('async-task-group')

// Limit task concurrency by passing a number (optional).
const tasks = new AsyncTaskGroup(5)

tasks.push(() => {
  // Tasks can be sync or async.
})

// Add an array of tasks.
tasks.concat([ task1, task2 ])

// Map values of an array into tasks.
tasks.map(array, (value, index) => {
  // This return value must be a task.
  return () => value
})

// Wait for all tasks to finish.
const promise = tasks.then(() => {})

// Attach an error handler.
const promise = tasks.catch(e => {})

// Provide a "wrap function" that maps every task value.
const tasks = new AsyncTaskGroup(2, fetch)
```
