import test from 'ava'
import { renderNode, renderOpeningTag, renderClosingTag } from '../renderer'

test('renderNode will render primitives correctly', t => {
  t.is(renderNode(undefined), '')
  t.is(renderNode(null), '')
  t.is(renderNode(true), '')
  t.is(renderNode(false), '')
  t.is(renderNode(42), '42')
  t.is(renderNode('hello'), 'hello')
})

test('renderNode will render elements', t => {
  t.is(renderNode({ elementName: 'a', attributes: {}, children: [] }), '<a></a>')
})

test('renderNode will render elements with children', t => {
  t.is(
    renderNode({
      elementName: 'a',
      attributes: {},
      children: [
        42,
        ' hello ',
        { elementName: 'b', attributes: {}, children: [] }
      ],
    }),
    '<a>42 hello <b></b></a>'
  )
})

test('renderNode will render elements without attributes', t => {
  t.is(renderNode({ elementName: 'a', children: [] }), '<a></a>')
})

test('renderNode will render elements without children', t => {
  t.is(renderNode({ elementName: 'a', attributes: { hello: 'world' } }), '<a hello="world"/>')
})

test('renderOpeningTag will render the opening tag', t => {
  t.is(renderOpeningTag('a', {}), '<a>')
})

test('renderOpeningTag will render the opening tag with attributes', t => {
  t.is(renderOpeningTag('a', { hello: 'world', answer: 42 }), '<a hello="world" answer="42">')
})

test('renderClosingTag will render the closing tag', t => {
  t.is(renderClosingTag('a'), '</a>')
})
