'use strict'

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

suite.on('cycle', function (event) {
  console.log(event.target.toString())
})

suite.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
})

suite.run({
  async: true
})
