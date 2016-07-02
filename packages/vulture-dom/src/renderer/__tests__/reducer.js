import 'test-dom'

import test from 'ava'
import { $$key } from '../path'
import { reduceNode } from '../reducer'

test('reduceNode will fail if the path does not select an actual node', t => {
  const a = document.createElement('a')
  t.throws(() => reduceNode(a, { path: ['b'] }))
  t.throws(() => reduceNode(a, { path: ['b', 'c'] }))
})

test('reduceNode will replace nodes', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  t.is(a.outerHTML, '<a><b></b></a>')
  reduceNode(a, { type: 'NODE_REPLACE', path: ['b'], node: 42 })
  t.is(a.outerHTML, '<a>42</a>')
})

test('reduceNode will replace nodes and set the correct key', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  t.is(a.firstChild, b)
  t.is(a.firstChild[$$key], 'b')
  reduceNode(a, { type: 'NODE_REPLACE', path: ['b'], node: 42 })
  t.not(a.firstChild, b)
  t.is(a.firstChild[$$key], 'b')
})

test('reduceNode will actually replace the root node', t => {
  const parent = document.createElement('parent')
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  parent.appendChild(a)
  t.is(reduceNode(a, { type: 'NODE_REPLACE', path: ['b'], node: 42 }), a)
  t.not(reduceNode(a, { type: 'NODE_REPLACE', path: [], node: 42 }), a)
})

test('reduceNode will set attributes', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  reduceNode(a, { type: 'ATTRIBUTE_SET', path: [], name: 'foo', value: 1 })
  reduceNode(a, { type: 'ATTRIBUTE_SET', path: ['b'], name: 'bar', value: 2 })
  t.is(a.getAttribute('foo'), '1')
  t.is(b.getAttribute('bar'), '2')
})

test('reduceNode will not set attributes for non-elements', t => {
  const a = document.createElement('a')
  const b = document.createTextNode('b')
  b[$$key] = 'b'
  a.appendChild(b)
  t.throws(() => reduceNode(a, { type: 'ATTRIBUTE_SET', path: ['b'], name: 'foo', value: 1 }))
})

test('reduceNode will remove attributes', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  a.setAttribute('foo', 1)
  b.setAttribute('bar', 2)
  b[$$key] = 'b'
  a.appendChild(b)
  t.true(a.hasAttribute('foo'))
  t.true(b.hasAttribute('bar'))
  reduceNode(a, { type: 'ATTRIBUTE_REMOVE', path: [], name: 'foo' })
  reduceNode(a, { type: 'ATTRIBUTE_REMOVE', path: ['b'], name: 'bar' })
  t.false(a.hasAttribute('foo'))
  t.false(b.hasAttribute('bar'))
})

test('reduceNode will not remove attributes for non-elements', t => {
  const a = document.createElement('a')
  const b = document.createTextNode('b')
  b[$$key] = 'b'
  a.appendChild(b)
  t.throws(() => reduceNode(a, { type: 'ATTRIBUTE_REMOVE', path: ['b'], name: 'foo' }))
})

test('reduceNode will add JSX children', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  reduceNode(a, { type: 'CHILDREN_ADD', path: [], key: 'c', node: 'c' })
  t.is(a.outerHTML, '<a><b></b>c</a>')
  reduceNode(a, { type: 'CHILDREN_ADD', path: ['b'], key: 'd', node: 'd' })
  t.is(a.outerHTML, '<a><b>d</b>c</a>')
})

test('reduceNode will remove JSX children', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  const c = document.createElement('c')
  b[$$key] = 'b'
  c[$$key] = 'c'
  a.appendChild(b)
  b.appendChild(c)
  t.is(a.outerHTML, '<a><b><c></c></b></a>')
  reduceNode(a, { type: 'CHILDREN_REMOVE', path: ['b'], key: 'c' })
  t.is(a.outerHTML, '<a><b></b></a>')
  reduceNode(a, { type: 'CHILDREN_REMOVE', path: [], key: 'b' })
  t.is(a.outerHTML, '<a></a>')
})

test('reduceNode will not remove JSX children that can’t be reached', t => {
  const a = document.createElement('a')
  const b = document.createElement('b')
  b[$$key] = 'b'
  a.appendChild(b)
  t.throws(() => reduceNode(a, { type: 'CHILDREN_REMOVE', path: ['b'], key: 'c' }))
  t.throws(() => reduceNode(a, { type: 'CHILDREN_REMOVE', path: [], key: 'c' }))
})

test('reduceNode will correctly reorder child nodes', t => {
  const parent = document.createElement('div')
  const a = document.createTextNode('1')
  const b = document.createTextNode('2')
  const c = document.createTextNode('3')
  const d = document.createTextNode('4')
  const e = document.createTextNode('5')
  a[$$key] = 'a'
  b[$$key] = 'b'
  c[$$key] = 'c'
  d[$$key] = 'd'
  e[$$key] = 'e'
  parent.appendChild(a)
  parent.appendChild(b)
  parent.appendChild(c)
  parent.appendChild(d)
  parent.appendChild(e)
  t.is(parent.innerHTML, '12345')
  reduceNode(parent, { type: 'CHILDREN_ORDER', path: [], keys: ['e', 'd', 'c', 'b', 'a'] })
  t.is(parent.innerHTML, '54321')
  reduceNode(parent, { type: 'CHILDREN_ORDER', path: [], keys: ['a', 'b', 'c', 'd', 'e'] })
  t.is(parent.innerHTML, '12345')
  reduceNode(parent, { type: 'CHILDREN_ORDER', path: [], keys: ['e', 'b', 'c', 'd', 'a'] })
  t.is(parent.innerHTML, '52341')
  reduceNode(parent, { type: 'CHILDREN_ORDER', path: [], keys: ['b', 'd', 'a', 'e', 'c'] })
  t.is(parent.innerHTML, '24153')
})
