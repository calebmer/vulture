var assert = require('assert')
var noop = require('lodash/noop')
var clone = require('lodash/clone')
var reduce = require('../lib/reduce')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var mapOrder = Series.mapOrder

describe('reduce()', () => {
  it('will iterate over all a node‘s children', () => {
    var called = 0
    var node = Series(sampleData)
    reduce(node, () => called += 1)
    assert.equal(called, mapOrder.length)
  })

  it('will reduce a tree into a single value', () => {
    var node = Series(sampleData)
    var count = reduce(node, currentValue => currentValue ? currentValue + 1 : 1)
    assert.equal(count, mapOrder.length)
  })

  it('can set the initial value', () => {
    var node = Series(sampleData)
    var count = reduce(node, value => value + 1, 5)
    assert.equal(count, mapOrder.length + 5)
  })

  it('will use each node in reducing', () => {
    var node = Series(sampleData)
    var value = reduce(node, (value, childNode) => value + childNode.tagName, '')
    assert.equal(value.toLowerCase(), mapOrder.join(''))
  })

  it('will reduce in the correct order', () => {
    var called = 0
    var nextTagName = clone(mapOrder)
    var node = Series(sampleData)
    reduce(node, (value, childNode) => {
      called += 1
      assert.equal(childNode.tagName.toLowerCase(), nextTagName.shift().toLowerCase())
    })
    assert.equal(called, mapOrder.length)
  })

  it('will pass down the root node', () => {
    var called = false
    var node = Series(sampleData)
    reduce(node, (value, childNode, rootNode) => {
      called = true
      assert.equal(rootNode, node)
    })
    assert(called)
  })
})
