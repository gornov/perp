/**
 * Wrapper over Promise with external-accessible resolve/reject callbacks
 *
 * Usage:
 * const deferred = new Deferred();
 * deferred.promise.then(...);
 * deferred.resolve();
 */
export default class Deferred<T = unknown> {
  public resolve!: (value: T) => void
  public reject!: (reason?: unknown) => void
  public status: 'pending' | 'fulfilled' | 'rejected' = 'pending'
  public promise = new Promise<T>((resolve, reject) => {
    this.resolve = (value) => {
      this.status = 'fulfilled'
      resolve(value)
    }
    this.reject = (reason?: unknown) => {
      this.status = 'rejected'
      reject(reason)
    }
  })
}
