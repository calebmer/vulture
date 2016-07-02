import test from 'ava'
import { getPathKey } from '../path'

test('getPathKey will just be the number for primitives', t => {
  t.is(getPathKey(undefined, 1), '1')
  t.is(getPathKey(null, 2), '2')
  t.is(getPathKey(true, 3), '3')
  t.is(getPathKey(42, 4), '4')
  t.is(getPathKey('42', 5), '5')
})

test('getPathKey will be the number for an element without the correct attributes', t => {
  t.is(getPathKey({ elementName: 'a', attributes: {} }, 6), '6')
})

test('getPathKey will be the `id` attribute if it exists', t => {
  t.is(getPathKey({ elementName: 'a', attributes: { id: 'hello' } }, 7), 'hello')
})

test('getPathKey will be the `key` attribute if it exists', t => {
  t.is(getPathKey({ elementName: 'a', attributes: { key: 'world' } }, 8), 'world')
})

test('getPathKey will use `id` over `key` if both exist', t => {
  t.is(getPathKey({ elementName: 'a', attributes: { id: 'hello', key: 'world' } }, 9), 'hello')
})
