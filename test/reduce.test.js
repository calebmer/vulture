var assert = require('assert')
var clone = require('lodash/clone')
var reduce = require('../lib/reduce')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var mapOrder = Series.mapOrder

describe('reduce()', function () {
  it('will iterate over all a node‘s children', function () {
    var called = 0
    var node = Series(sampleData)
    reduce(node, function () {
      called += 1
    })
    assert.equal(called, mapOrder.length)
  })

  it('will reduce a tree into a single value', function () {
    var node = Series(sampleData)
    var count = reduce(node, function (currentValue) {
      return currentValue ? currentValue + 1 : 1
    })
    assert.equal(count, mapOrder.length)
  })

  it('can set the initial value', function () {
    var node = Series(sampleData)
    var count = reduce(node, function (value) {
      return value + 1
    }, 5)
    assert.equal(count, mapOrder.length + 5)
  })

  it('will use each node in reducing', function () {
    var node = Series(sampleData)
    var value = reduce(node, function (value, childNode) {
      return value + childNode.tagName
    }, '')
    assert.equal(value.toLowerCase(), mapOrder.join(''))
  })

  it('will reduce in the correct order', function () {
    var called = 0
    var nextTagName = clone(mapOrder)
    var node = Series(sampleData)
    reduce(node, function (value, childNode) {
      called += 1
      assert.equal(childNode.tagName.toLowerCase(), nextTagName.shift().toLowerCase())
    })
    assert.equal(called, mapOrder.length)
  })

  it('will pass down the root node', function () {
    var called = false
    var node = Series(sampleData)
    reduce(node, function (value, childNode, rootNode) {
      called = true
      assert.equal(rootNode, node)
    })
    assert(called)
  })
})
