var assert = require('assert')
var noop = require('lodash/noop')
var clone = require('lodash/clone')
var cloneDeep = require('lodash/cloneDeep')
var forEach = require('../lib/forEach')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var mapOrder = Series.mapOrder

describe('forEach()', () => {
  it('iterator will only create side effects', () => {
    var node = Series(sampleData)
    var cachedNode = cloneDeep(node)
    assert.equal(forEach(node, noop), noop())
    assert.deepEqual(node, cachedNode)
  })

  it('will iterate over all a node‘s children', () => {
    var called = 0
    var node = Series(sampleData)
    forEach(node, () => called += 1)
    assert.equal(called, mapOrder.length)
  })

  it('will iterate in the correct order', () => {
    var called = 0
    var nextTagName = clone(mapOrder)
    var node = Series(sampleData)
    forEach(node, childNode => {
      called += 1
      assert.equal(childNode.tagName.toLowerCase(), nextTagName.shift().toLowerCase())
    })
    assert.equal(called, mapOrder.length)
  })

  it('will pass down the root node', () => {
    var called = false
    var node = Series(sampleData)
    forEach(node, (childNode, rootNode) => {
      called = true
      assert.equal(rootNode, node)
    })
    assert(called)
  })
})
