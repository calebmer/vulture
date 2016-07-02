/**
 * Converts a plain value, promise, or observable into an observable.
 */
// TODO: When Typescript 2 goes out of beta, see why these typeguards aren’t
// working.
export function intoObservable <T>(box: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(box)) {
    return Observable.from(box)
  }
  else if (isPromise(box)) {
    return new Observable<T>(observer => {
      // TODO: here, and…
      (box as Promise<T>).then(
        value => {
          if (observer.closed) return
          observer.next(value)
          observer.complete()
        },
        (error: Error) => {
          if (observer.closed) return
          observer.error(error)
          observer.complete()
        }
      )
      return () => {}
    })
  }
  else {
    return new Observable<T>(observer => {
      // TODO: here
      observer.next(box as T)
      observer.complete()
      return () => {}
    })
  }
}

const $$observable = Symbol['observable'] ? Symbol['observable'] : '@@observable'

function isObservable <T>(value: any): value is Observable<T> {
  return value != null && typeof value === 'object' && value[$$observable]
}

function isPromise <T>(value: any): value is Promise<T> {
  return value != null && typeof value === 'object' && typeof value.then === 'function'
}
