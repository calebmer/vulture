import 'test-dom'

import test from 'ava'
import { setAttribute, removeAttribute } from '../attributes'

test('setAttribute will set numbers and strings', t => {
  const element = document.createElement('div')
  setAttribute(element, 'a', 'hello')
  setAttribute(element, 'b', 42)
  t.is(element.getAttribute('a'), 'hello')
  t.is(element.getAttribute('b'), '42')
})

test('setAttribute will ignore undefined, null, and false', t => {
  const element = document.createElement('div')
  setAttribute(element, 'a', undefined)
  setAttribute(element, 'b', null)
  setAttribute(element, 'c', false)
  t.false(element.hasAttribute('a'))
  t.false(element.hasAttribute('b'))
  t.false(element.hasAttribute('c'))
})

test('setAttribute will assign event handlers to the element', t => {
  const element = document.createElement('div')
  setAttribute(element, 'onClick', 'hello')
  t.false(element.hasAttribute('onClick'))
  t.is(element['onclick'], 'hello')
})

test('removeAttribute will remove attributes', t => {
  const element = document.createElement('div')
  element.setAttribute('a', '1')
  element.setAttribute('b', '2')
  element.setAttribute('c', '3')
  removeAttribute(element, 'a')
  removeAttribute(element, 'c')
  t.false(element.hasAttribute('a'))
  t.true(element.hasAttribute('b'))
  t.false(element.hasAttribute('c'))
})

test.todo('removeAttribute will remove event handlers')
