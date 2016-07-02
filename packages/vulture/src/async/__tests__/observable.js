import test from 'ava'
import { intoObservable } from '../observable'

test('intoObservable does nothing to observables', t => {
  t.plan(1)
  return (
    intoObservable(Observable.of(1, 2, 3))
    .toArray()
    .do(history => t.deepEqual(history, [1, 2, 3]))
  )
})

test('intoObservable will turn a promise into an observable', t => {
  t.plan(1)
  return (
    intoObservable(Promise.resolve(42))
    .toArray()
    .do(history => t.deepEqual(history, [42]))
  )
})

test('intoObservable will turn a plain value into an observable', t => {
  t.plan(1)
  return (
    intoObservable(42)
    .toArray()
    .do(history => t.deepEqual(history, [42]))
  )
})
