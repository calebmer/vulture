var assert = require('assert')
var h = require('virtual-dom/h')
var renderToString = require('../lib/renderToString')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData

describe('renderToString()', function () {
  it('will render a virtual DOM', function () {
    assert.equal(renderToString(Series(sampleData)), '<div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div>')
  })

  it('will not close empty tags', function () {
    assert.equal(renderToString(h('div', [h('div'), h('input')])), '<div><div></div><input></div>')
  })

  it('will render an array', function () {
    assert.equal(renderToString([h('div'), h('div'), h('div')]), '<div></div><div></div><div></div>')
  })
})
