
function AsyncTaskGroup(limit = Infinity) {
  if (limit <= 0) {
    throw TypeError('Expected a positive number')
  }
  this.maxConcurrent = limit
  this.numConcurrent = 0
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })
  this.queue = []
  this.error = null
}

module.exports = AsyncTaskGroup

AsyncTaskGroup.prototype = {
  constructor: AsyncTaskGroup,
  push(task) {
    if (typeof task != 'function') {
      throw TypeError('Expected a function')
    }
    if (!this.error) {
      if (this.numConcurrent < this.maxConcurrent) {
        this._run(task)
      } else {
        this.queue.push(task)
      }
    }
    return this
  },
  concat(tasks) {
    tasks.forEach(task => this.push(task))
    return this
  },
  map(tasks, transform) {
    tasks.forEach((task, i) => this.push(transform(task, i)))
    return this
  },
  then(onResolved, onRejected) {
    return this.promise.then(onResolved, onRejected)
  },
  catch(onRejected) {
    return this.promise.catch(onRejected)
  },
  async _run(task) {
    this.numConcurrent += 1
    try {
      await task()
      this.numConcurrent -= 1
      if (!this.error) {
        const task = this.queue.shift()
        if (task) {
          this._run(task)
        } else if (this.numConcurrent == 0) {
          this.resolve()
        }
      }
    } catch(error) {
      this.error = error
      this.reject(error)
    }
  },
}
