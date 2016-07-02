import test from 'ava'

import {
  Patch,
  NODE_REPLACE,
  ATTRIBUTE_SET,
  ATTRIBUTE_REMOVE,
  CHILDREN_ADD,
  CHILDREN_ORDER,
  CHILDREN_REMOVE,
} from '../patch'

import { diffNode, diffElement, diffAttributes, diffChildren } from '../diff'

test('diffNode will have no patches for the same node', t => {
  const jsx = { elementName: 'a' }
  t.deepEqual(diffNode(42, 42, []), [])
  t.deepEqual(diffNode(jsx, jsx, []), [])
})

test('diffNode will replace different nodes', t => {
  t.deepEqual(diffNode(1, 2, []), [{ type: NODE_REPLACE, path: [], node: 2 }])
  t.deepEqual(diffNode(true, 'hello', []), [{ type: NODE_REPLACE, path: [], node: 'hello' }])
  t.deepEqual(diffNode('hello', { elementName: 'a' }, []), [{ type: NODE_REPLACE, path: [], node: { elementName: 'a' } }])
  t.deepEqual(diffNode({ elementName: 'a' }, 'world', []), [{ type: NODE_REPLACE, path: [], node: 'world' }])
})

test('diffNode will pass through the path', t => {
  t.deepEqual(diffNode(1, 2, ['a', 'b', 'c']), [{ type: NODE_REPLACE, path: ['a', 'b', 'c'], node: 2 }])
  t.deepEqual(diffNode(1, 2, ['d', 'e']), [{ type: NODE_REPLACE, path: ['d', 'e'], node: 2 }])
})

test('diffElement will return nothing for identical elements', t => {
  const jsx = { elementName: 'a' }
  t.deepEqual(diffElement(jsx, jsx, []), [])
  t.deepEqual(diffElement({ elementName: 'b' }, { elementName: 'b' }, []), [])
})

test('diffElement will return node replace when names are different', t => {
  t.deepEqual(diffElement({ elementName: 'a' }, { elementName: 'b' }, []), [{ type: NODE_REPLACE, path: [], node: { elementName: 'b' } }])
})

test('diffAttributes will set new attributes', t => {
  t.deepEqual(diffAttributes({}, { a: 1 }, []), [{ type: ATTRIBUTE_SET, path: [], name: 'a', value: 1 }])
})

test('diffAttributes will replace old attributes', t => {
  t.deepEqual(diffAttributes({ a: 1 }, { a: 2 }, []), [{ type: ATTRIBUTE_SET, path: [], name: 'a', value: 2 }])
})

test('diffAttributes will remove old attributes', t => {
  t.deepEqual(diffAttributes({ a: 1 }, {}, []), [{ type: ATTRIBUTE_REMOVE, path: [], name: 'a' }])
})

test('diffAttributes will diff attributes', t => {
  t.deepEqual(diffAttributes({ a: 1, b: 2, c: 3 }, { a: 1, b: 3, d: 4 }, []), [
    { type: ATTRIBUTE_SET, path: [], name: 'b', value: 3 },
    { type: ATTRIBUTE_SET, path: [], name: 'd', value: 4 },
    { type: ATTRIBUTE_REMOVE, path: [], name: 'c' },
  ])
})

test('diffChildren will add a child', t => {
  t.deepEqual(diffChildren([], [1], []), [
    { type: CHILDREN_ADD, path: [], key: '0', node: 1 },
    { type: CHILDREN_ORDER, path: [], keys: ['0'] },
  ])
  t.deepEqual(diffChildren([1], [1, 2], []), [
    { type: CHILDREN_ADD, path: [], key: '1', node: 2 },
    { type: CHILDREN_ORDER, path: [], keys: ['0', '1'] },
  ])
  t.deepEqual(diffChildren([1], [1, 2, 3], []), [
    { type: CHILDREN_ADD, path: [], key: '1', node: 2 },
    { type: CHILDREN_ADD, path: [], key: '2', node: 3 },
    { type: CHILDREN_ORDER, path: [], keys: ['0', '1', '2'] },
  ])
})

test('diffChildren will replace poorly keyed nodes instead of adding', t => {
  t.deepEqual(diffChildren([2], [1, 2], []), [
    { type: NODE_REPLACE, path: ['0'], node: 1 },
    { type: CHILDREN_ADD, path: [], key: '1', node: 2 },
    { type: CHILDREN_ORDER, path: [], keys: ['0', '1'] },
  ])
  t.deepEqual(diffChildren([2, 3], [1, 2, 3], []), [
    { type: NODE_REPLACE, path: ['0'], node: 1 },
    { type: NODE_REPLACE, path: ['1'], node: 2 },
    { type: CHILDREN_ADD, path: [], key: '2', node: 3 },
    { type: CHILDREN_ORDER, path: [], keys: ['0', '1', '2'] },
  ])
})

test('diffChildren will add a well keyed node', t => {
  t.deepEqual(diffChildren([
    { elementName: 'a', attributes: { key: 'a' } },
  ], [
    { elementName: 'b', attributes: { key: 'b' } },
    { elementName: 'a', attributes: { key: 'a' } },
  ], []), [
    { type: CHILDREN_ADD, path: [], key: 'b', node: { elementName: 'b', attributes: { key: 'b' } } },
    { type: CHILDREN_ORDER, path: [], keys: ['b', 'a'] },
  ])
})

test('diffChildren will remove a child', t => {
  t.deepEqual(diffChildren([1], [], []), [
    { type: CHILDREN_REMOVE, path: [], key: '0' },
    { type: CHILDREN_ORDER, path: [], keys: [] },
  ])
  t.deepEqual(diffChildren([1, 2], [1], []), [
    { type: CHILDREN_REMOVE, path: [], key: '1' },
    { type: CHILDREN_ORDER, path: [], keys: ['0'] },
  ])
  t.deepEqual(diffChildren([1, 2, 3], [1], []), [
    { type: CHILDREN_REMOVE, path: [], key: '1' },
    { type: CHILDREN_REMOVE, path: [], key: '2' },
    { type: CHILDREN_ORDER, path: [], keys: ['0'] },
  ])
})

test('diffChildren will replace poorly keyed children instead of removing', t => {
  t.deepEqual(diffChildren([1, 2], [2], []), [
    { type: NODE_REPLACE, path: ['0'], node: 2 },
    { type: CHILDREN_REMOVE, path: [], key: '1' },
    { type: CHILDREN_ORDER, path: [], keys: ['0'] },
  ])
})

test('diffChildren will remove well keyed children', t => {
  t.deepEqual(diffChildren([
    { elementName: 'a', attributes: { key: 'a' } },
    { elementName: 'b', attributes: { key: 'b' } },
  ], [
    { elementName: 'b', attributes: { key: 'b' } },
  ], []), [
    { type: CHILDREN_REMOVE, path: [], key: 'a' },
    { type: CHILDREN_ORDER, path: [], keys: ['b'] },
  ])
})

test('diffChildren will replace poorly keyed children instead of ordering', t => {
  t.deepEqual(diffChildren([2, 1, 3], [1, 2, 3], []), [
    { type: NODE_REPLACE, path: ['0'], node: 1 },
    { type: NODE_REPLACE, path: ['1'], node: 2 },
  ])
})

test('diffChildren will order well keyed children', t => {
  t.deepEqual(diffChildren([
    { elementName: 'b', attributes: { key: 'b' } },
    { elementName: 'a', attributes: { key: 'a' } },
    { elementName: 'c', attributes: { key: 'c' } },
  ], [
    { elementName: 'a', attributes: { key: 'a' } },
    { elementName: 'b', attributes: { key: 'b' } },
    { elementName: 'c', attributes: { key: 'c' } },
  ], []), [
    { type: CHILDREN_ORDER, path: [], keys: ['a', 'b', 'c'] }
  ])
})

test('diffChildren will correctly patch falsey values', t => {
  t.deepEqual(diffChildren([null], [42], []), [{ type: NODE_REPLACE, path: ['0'], node: 42 }])
})
