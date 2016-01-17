var assert = require('assert')
var noop = require('lodash/noop')
var identity = require('lodash/identity')
var jsdom = require('jsdom').jsdom
var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element')
var VNode = require('virtual-dom/vnode/vnode')
var EventHook = require('../lib/EventHook')
var v = require('../lib/v')
var Series = require('./fixtures/series')

var sampleData = Series.sampleData

describe('v()', function () {
  it('will default to div when there is no tag name', function () {
    assert.deepEqual(
      v({}, []),
      v('div', {}, [])
    )
  })

  it('will work when there is no properties', function () {
    assert.deepEqual(
      v('div', ['child']),
      v('div', {}, ['child'])
    )
  })

  it('will work when there is only children', function () {
    assert.deepEqual(
      v(['child']),
      v('div', {}, ['child'])
    )
  })

  it('will work even if children is not an array', function () {
    assert.deepEqual(
      v('div', 'child'),
      v('div', {}, ['child'])
    )

    assert.deepEqual(
      v('div', v(v('p', 'hello'))),
      v('div', {}, [v('div', {}, [v('p', {}, ['hello'])])])
    )
  })

  it('will work with nothing', function () {
    assert.deepEqual(
      v(),
      v('div', {}, [])
    )
  })

  it('turns special properties into event hooks', function () {
    var vnode = v('div', {
      click: identity,
      onClick: identity,
      onTap: identity,
      onMouseOver: identity,
      onWhatever: identity
    })

    assert(!(vnode.properties.click instanceof EventHook))
    assert(vnode.properties.onClick instanceof EventHook)
    assert.equal(vnode.properties.onClick.event, 'click')
    assert.equal(vnode.properties.onClick.listener, identity)
    assert(vnode.properties.onTap instanceof EventHook)
    assert.equal(vnode.properties.onTap.event, 'tap')
    assert(vnode.properties.onMouseOver instanceof EventHook)
    assert.equal(vnode.properties.onMouseOver.event, 'mouseover')
    assert(vnode.properties.onWhatever instanceof EventHook)
    assert.equal(vnode.properties.onWhatever.event, 'whatever')
  })

  it('attaches event hooks correctly', () => {
    var clicks = 0

    var vnode = v('div', {
      onClick: () => clicks += 1
    })

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var node = createElement(vnode, { document: document })
    container.appendChild(node)
    assert.equal(clicks, 0)
    node.dispatchEvent(new Event('click'))
    assert.equal(clicks, 1)
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    assert.equal(clicks, 4)
  })

  it('aliases common attribute names', () => {
    var vnode = v('div', {
      class: 'a',
      for: 'b'
    })

    assert.equal(vnode.properties.className, 'a')
    assert.equal(vnode.properties.htmlFor, 'b')
  })

  it('will set the id to key when key does not exist', () => {
    assert.deepEqual(v('DIV', { id: 'a' }, []), new VNode('DIV', { id: 'a', key: noop() }, [], 'a'))
    assert.deepEqual(v('DIV', { id: 'a', key: 'b' }, []), new VNode('DIV', { id: 'a', key: noop() }, [], 'b'))
  })
})
