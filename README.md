
# AsyncTaskGroup v1.0.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

The `AsyncTaskGroup` class is like `Promise.all`, but more flexible. Tasks can be added any time before completion. This means promises within an `AsyncTaskGroup` can easily extend the lifetime of an `AsyncTaskGroup` by adding more tasks to it.

Similar to `Promise.all`, remaining tasks are not executed if a preceding task throws an error.

```js
const AsyncTaskGroup = require('AsyncTaskGroup')

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

//
```