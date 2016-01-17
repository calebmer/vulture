var assert = require('assert')
var clone = require('lodash/clone')
var h = require('virtual-dom/h')
var map = require('../lib/map')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var mapOrder = Series.mapOrder

describe('map()', () => {
  it('will map a virtual DOM tree', () => {
    var prevNode = Series(sampleData)
    var nextNode = map(prevNode, node => h(node.tagName))
    assert.deepEqual(nextNode, h('DIV'))
  })

  it('will map over all a node‘s children', () => {
    var called = 0
    var prevNode = Series(sampleData)
    var nextNode = map(prevNode, node => (called += 1, h(node.tagName, node.children)))
    assert.equal(called, mapOrder.length)
  })

  it('will map in the correct order', () => {
    var called = 0
    var nextTagName = clone(mapOrder)
    var prevNode = Series(sampleData)
    var nextNode = map(prevNode, node => {
      called += 1
      assert.equal(node.tagName.toLowerCase(), nextTagName.shift().toLowerCase())
      return node
    })
    assert.equal(called, mapOrder.length)
  })

  it('will pass down the root node', () => {
    var called = false
    var prevNode = Series(sampleData)
    var nextNode = map(prevNode, (node, rootNode) => {
      called = true
      assert.equal(rootNode, prevNode)
      return h(node.tagName, node.children)
    })
    assert(called)
  })
})
