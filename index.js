
class AsyncTaskGroup {
  constructor(limit, wrap) {
    if (typeof limit == 'function') {
      this._wrap = limit
      limit = undefined
    } else if (typeof wrap == 'function') {
      this._wrap = wrap
    }
    this.limit = limit
    this.count = 0
    this.queue = []
    this.error = null
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
  push(task) {
    if (!this.error) {
      if (this.count !== this.limit) {
        this._run(task)
      } else {
        this.queue.push(task)
      }
    }
    return this
  }
  concat(tasks) {
    tasks.forEach(task => this.push(task))
    return this
  }
  map(tasks, transform) {
    tasks.forEach((task, i) => this.push(transform(task, i)))
    return this
  }
  then(onResolved, onRejected) {
    return this.promise.then(onResolved, onRejected)
  }
  catch(onRejected) {
    return this.promise.catch(onRejected)
  }
  _wrap(task) {
    return typeof task == 'function' ? task() : task
  }
  async _run(task) {
    this.count += 1
    try {
      await this._wrap(task)
    } catch(error) {
      this.error = error
      return this.reject(error)
    }
    this.count -= 1
    this._next()
  }
  _next() {
    const task = this.queue.shift()
    if (task) {
      this._run(task)
    } else if (this.count == 0) {
      this.resolve()
    }
  }
}

module.exports = AsyncTaskGroup
