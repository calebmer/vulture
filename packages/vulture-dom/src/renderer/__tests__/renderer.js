import 'test-dom'

import test from 'ava'
import { renderNode } from '../renderer'

test('renderNode will render text elements for primitive nodes', t => {
  t.is(renderNode(undefined).nodeValue, '')
  t.is(renderNode(null).nodeValue, '')
  t.is(renderNode(true).nodeValue, '')
  t.is(renderNode(false).nodeValue, '')
  t.is(renderNode(42).nodeValue, '42')
  t.is(renderNode('hello').nodeValue, 'hello')
})

test('renderNode will render an element with an element name', t => {
  t.is(renderNode({ elementName: 'div' }).tagName.toLowerCase(), 'div')
  t.is(renderNode({ elementName: 'h1' }).tagName.toLowerCase(), 'h1')
})

test('renderNode will render an element with some attributes', t => {
  const element = renderNode({ elementName: 'div', attributes: { a: 'hello', b: 42 } })
  t.is(element.getAttribute('a'), 'hello')
  t.is(element.getAttribute('b'), '42')
})

test('renderNode with null, undefined, or false attributes will not exist', t => {
  const element = renderNode({ elementName: 'div', attributes: { a: undefined, b: null, c: false } })
  t.false(element.hasAttribute('a'))
  t.false(element.hasAttribute('b'))
  t.false(element.hasAttribute('c'))
})

test('renderNode with true will set an attribute with an empty string', t => {
  const element = renderNode({ elementName: 'div', attributes: { a: true } })
  t.true(element.hasAttribute('a'))
  t.is(element.getAttribute('a'), '')
})
