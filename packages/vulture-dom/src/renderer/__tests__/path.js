import 'test-dom'

import test from 'ava'
import { $$key, lookupPath } from '../path'

test('lookupPath will return the node for an empty path', t => {
  const node = document.createTextNode('hello')
  t.is(lookupPath(node, []), node)
})

test('lookupPath will find a node using a single step path', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  const c = document.createElement('c')
  const d = document.createTextNode('d')
  a[$$key] = 'a'
  b[$$key] = 'b'
  c[$$key] = 'c'
  d[$$key] = 'd'
  a.appendChild(b)
  a.appendChild(c)
  a.appendChild(d)
  t.is(lookupPath(a, ['b']), b)
  t.is(lookupPath(a, ['c']), c)
  t.is(lookupPath(a, ['d']), d)
})

test('lookupPath will find a node using a two step path', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  const c = document.createElement('c')
  a[$$key] = 'a'
  b[$$key] = 'b'
  c[$$key] = 'c'
  a.appendChild(b)
  b.appendChild(c)
  t.is(lookupPath(a, ['b']), b)
  t.is(lookupPath(a, ['b', 'c']), c)
})

test('lookupPath will return falsy when not found', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  const c = document.createElement('c')
  a[$$key] = 'a'
  b[$$key] = 'b'
  c[$$key] = 'c'
  a.appendChild(b)
  b.appendChild(c)
  t.falsy(lookupPath(a, ['b', 'c', 'd', 'e']))
  t.falsy(lookupPath(a, ['b', 'c', 'd']))
  t.falsy(lookupPath(a, ['b', 'd']))
  t.falsy(lookupPath(a, ['c']))
})
