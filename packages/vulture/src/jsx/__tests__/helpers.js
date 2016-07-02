import test from 'ava'
import { jsx, isJSXElement, isJSXPrimitive, primitiveToString } from '../helpers'

test('jsx will create an element with just a name', t => {
  t.deepEqual(jsx('a'), { elementName: 'a' })
})

test('jsx will create an element with some attributes only', t => {
  t.deepEqual(jsx('a', { b: 1, c: 2 }), { elementName: 'a', attributes: { b: 1, c: 2 } })
})

test('jsx will create an element with some children only', t => {
  t.deepEqual(jsx('a', [3, 4]), { elementName: 'a', children: [3, 4] })
})

test('jsx will create an element with attributes and children', t => {
  t.deepEqual(jsx('a', { b: 1, c: 2 }, [3, 4]), { elementName: 'a', attributes: { b: 1, c: 2 }, children: [3, 4] })
})

test('isJSXElement will return false for non-objects', t => {
  t.false(isJSXElement(undefined))
  t.false(isJSXElement(null))
  t.false(isJSXElement(true))
  t.false(isJSXElement(42))
  t.false(isJSXElement('42'))
  t.false(isJSXElement([]))
  t.false(isJSXElement(() => {}))
})

test('isJSXElement will return false for objects without an element name', t => {
  t.false(isJSXElement({}))
  t.false(isJSXElement({ a: 1, b: 2 }))
  t.false(isJSXElement({ attributes: {}, children: [] }))
})

test('isJSXElement will return true for an object with an element name', t => {
  t.true(isJSXElement({ elementName: 'a' }))
  t.true(isJSXElement({ elementName: 'b', attributes: {} }))
  t.true(isJSXElement({ elementName: 'c', children: [] }))
  t.true(isJSXElement({ elementName: 'd', attributes: {}, children: [] }))
})

test('isJSXPrimitive will return false for non primitives', t => {
  t.false(isJSXPrimitive({}))
  t.false(isJSXPrimitive({ a: 1, b: 2 }))
  t.false(isJSXPrimitive({ elementName: 'a' }))
  t.false(isJSXPrimitive([]))
  t.false(isJSXPrimitive(() => {}))
})

test('isJSXPrimitive will return true for primitives', t => {
  t.true(isJSXPrimitive(undefined))
  t.true(isJSXPrimitive(null))
  t.true(isJSXPrimitive(true))
  t.true(isJSXPrimitive(42))
  t.true(isJSXPrimitive('42'))
})

test('primitiveToString will make null and undefined blank strings', t => {
  t.is(primitiveToString(undefined), '')
  t.is(primitiveToString(null), '')
})

test('primitiveToString will make booleans blank strings', t => {
  t.is(primitiveToString(false), '')
  t.is(primitiveToString(true), '')
})

test('primitiveToString will turn numbers into strings', t => {
  t.is(primitiveToString(42), '42')
  t.is(primitiveToString(12), '12')
  t.is(primitiveToString(-5), '-5')
})

test('primitiveToString will keep strings as strings', t => {
  t.is(primitiveToString('hello'), 'hello')
  t.is(primitiveToString('world'), 'world')
})
