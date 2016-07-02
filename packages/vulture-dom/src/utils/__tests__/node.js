import 'test-dom'

import test from 'ava'
import { isElement } from '../node'

test('isElement will tell an element from other node types', t => {
  t.true(isElement(document.createElement('div')))
  t.false(isElement(document.createTextNode('hello')))
})
