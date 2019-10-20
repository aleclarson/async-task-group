declare class AsyncTaskGroup<T = unknown> {
  constructor(limit?: number, wrap?: (task: T) => any)
  constructor(wrap?: (task: T) => any)

  push(task: T): this
  concat(tasks: readonly T[]): this
  map<U>(tasks: readonly U[], transform: (task: U) => any): this

  then<T = void, U = never>(
    onFulfilled: () => T | PromiseLike<T>,
    onRejected?: (reason: any) => U | PromiseLike<U>,
  ): Promise<T | U>

  catch<T = void>(
    onRejected: (reason: any) => T | PromiseLike<T>,
  ): Promise<T>
}
export = AsyncTaskGroup
