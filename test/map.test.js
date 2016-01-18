var assert = require('assert')
var clone = require('lodash/clone')
var h = require('virtual-dom/h')
var map = require('../lib/map')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var mapOrder = Series.mapOrder

describe('map()', function () {
  it('will map a virtual DOM tree', function () {
    var prevNode = Series(sampleData)
    var nextNode = map(prevNode, function (node) {
      return h(node.tagName)
    })
    assert.deepEqual(nextNode, h('DIV'))
  })

  it('will map over all a node‘s children', function () {
    var called = 0
    var prevNode = Series(sampleData)
    map(prevNode, function (node) {
      called += 1
      return h(node.tagName, node.children)
    })
    assert.equal(called, mapOrder.length)
  })

  it('will map in the correct order', function () {
    var called = 0
    var nextTagName = clone(mapOrder)
    var prevNode = Series(sampleData)
    map(prevNode, function (node) {
      called += 1
      assert.equal(node.tagName.toLowerCase(), nextTagName.shift().toLowerCase())
      return node
    })
    assert.equal(called, mapOrder.length)
  })

  it('will pass down the root node', function () {
    var called = false
    var prevNode = Series(sampleData)
    map(prevNode, function (node, rootNode) {
      called = true
      assert.equal(rootNode, prevNode)
      return h(node.tagName, node.children)
    })
    assert(called)
  })
})
