import test from 'ava'
import { createRenderStream } from '../stream'

const renderStream = createRenderStream({
  renderNode: node => node,
  renderOpeningTag: (elementName, attributes) => ({ openingTag: true, elementName, attributes }),
  renderClosingTag: elementName => ({ closingTag: true, elementName }),
})

test('renderStream only outputs the last node', t => {
  t.plan(1)
  return (
    renderStream(Observable.of(1, 2, 3))
    .toArray()
    .do(stream => t.deepEqual(stream, [3]))
  )
})

test('renderStream simply renders elements with no children', t => {
  t.plan(2)
  return Observable.merge(
    renderStream({ elementName: 'a' })
    .toArray()
    .do(stream => t.deepEqual(stream, [{ elementName: 'a' }])),

    renderStream({ elementName: 'a', children: [] })
    .toArray()
    .do(stream => t.deepEqual(stream, [{ elementName: 'a', children: [] }]))
  )
})

test('renderStream will render elements in parts', t => {
  t.plan(1)
  return (
    renderStream({ elementName: 'a', children: [1, 2, 3] })
    .toArray()
    .do(stream => t.deepEqual(stream, [
      { openingTag: true, elementName: 'a', attributes: {} },
      1,
      2,
      3,
      { closingTag: true, elementName: 'a' },
    ]))
  )
})

test('renderStream will render children asap', t => {
  t.plan(2)
  let timedOut = false
  // We want a timeout that’s not too short that we fail quickly, but also a
  // timeout that’s not too long that we aren’t testing what we want to test.
  //
  // We want to test that the third child does not emit itself 10ms after the
  // second child emits. The third child should have resolved before the second
  // child resolved, therefore we shouldn’t wait longer for it.
  //
  // Testing time is hard in tests…
  setTimeout(() => (timedOut = true), 45)
  return (
    renderStream({
      elementName: 'a',
      children: [
        Observable.of(1).delay(10),
        Observable.of(2).delay(30),
        Observable.of(3).delay(10)
      ],
    })
    .toArray()
    .do(() => t.false(timedOut))
    .do(stream => t.deepEqual(stream, [
      { openingTag: true, elementName: 'a', attributes: {} },
      1,
      2,
      3,
      { closingTag: true, elementName: 'a' },
    ]))
  )
})

test('renderStream will render nested elements in parts', t => {
  t.plan(1)
  return (
    renderStream({
      elementName: 'a',
      children: [{
        elementName: 'b',
        children: [{
          elementName: 'c',
          children: [{
            elementName: 'd',
          }]
        }],
      }]
    })
    .toArray()
    .do(stream => t.deepEqual(stream, [
      { openingTag: true, elementName: 'a', attributes: {} },
      { openingTag: true, elementName: 'b', attributes: {} },
      { openingTag: true, elementName: 'c', attributes: {} },
      { elementName: 'd' },
      { closingTag: true, elementName: 'c' },
      { closingTag: true, elementName: 'b' },
      { closingTag: true, elementName: 'a' },
    ]))
  )
})
