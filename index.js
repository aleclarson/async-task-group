
function AsyncTaskGroup(limit = Infinity, transform) {
  if (typeof limit == 'function') {
    transform = limit
    limit = Infinity
  }
  if (limit <= 0) {
    throw TypeError('Expected a positive number')
  }
  if (typeof transform == 'function') {
    this._transform = transform
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
    if (!this._transform && typeof task != 'function') {
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
      await (this._transform ? this._transform(task) : task())
    } catch(error) {
      this.error = error
      return this.reject(error)
    }
    this.numConcurrent -= 1
    this._next()
  },
  _next() {
    const task = this.queue.shift()
    if (task) {
      this._run(task)
    } else if (this.numConcurrent == 0) {
      this.resolve()
    }
  },
}
