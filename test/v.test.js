var assert = require('assert')
var identity = require('lodash/utility/identity')
var h = require('virtual-dom/h')
var VNode = require('virtual-dom/vnode/vnode')
var EventHook = require('../lib/EventHook')
var v = require('../lib/v')
var Series = require('./fixtures/series')

var sampleData = Series.sampleData

describe('v()', function () {
  it('works with jsx')

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

  it('aliases common attribute names', () => {
    var vnode = v('div', {
      class: 'a',
      for: 'b'
    })

    assert.equal(vnode.properties.className, 'a')
    assert.equal(vnode.properties.htmlFor, 'b')
  })
})
