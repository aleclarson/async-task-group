class AsyncTaskGroup implements PromiseLike<void> {
  constructor(limit?: number, wrap?: (task: unknown) => any)
  constructor(wrap?: (task: unknown) => any)

  push(task: unknown): this
  concat(tasks: readonly unknown[]): this
  map<T>(tasks: readonly T[], transform: (task: T) => any): this

  then<T, U = never>(
    onFulfilled?: (() => T | PromiseLike<T>) | undefined | null,
    onRejected?: ((reason: any) => U | PromiseLike<U>) | undefined | null,
  ): Promise<T | U>

  catch<T = never>(
    onRejected?: ((reason: any) => T | PromiseLike<T>) | undefined | null,
  ): Promise<T>
}
export = AsyncTaskGroup
