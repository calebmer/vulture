'use strict'

var assign = require('lodash/assign')
var clone = require('lodash/clone')
var Benchmark = require('benchmark')
var jsdom = require('jsdom').jsdom
var Series = require('../test/fixtures/Series')
var renderToDOM = require('../lib/renderToDOM')
var makeLazy = require('../lib/makeLazy')

var LazySeries = makeLazy(Series)
var sampleData = Series.sampleData

var window = jsdom('<div id="container"></div>').defaultView
var document = window.document
var container = document.getElementById('container')

function random (data) {
  return assign(clone(data), { random: Math.random() })
}

var suite = new Benchmark.Suite()

suite.add('identity(component)(data)', function () {
  renderToDOM(Series(sampleData), container, document)
})

suite.add('makeLazy(component)(data)', function () {
  renderToDOM(LazySeries(sampleData), container, document)
})

suite.add('identity(component)(clone(data))', function () {
  renderToDOM(Series(clone(sampleData)), container, document)
})

suite.add('makeLazy(component)(clone(data))', function () {
  renderToDOM(LazySeries(clone(sampleData)), container, document)
})

suite.add('identity(component)(random(data))', function () {
  renderToDOM(Series(random(sampleData)), container, document)
})

suite.add('makeLazy(component)(random(data))', function () {
  renderToDOM(LazySeries(random(sampleData)), container, document)
})

suite.on('cycle', function (event) {
  console.log(event.target.toString())
})

suite.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})

suite.run({
  async: true
})
