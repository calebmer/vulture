var assert = require('assert')
var assign = require('lodash/object/assign')
var renderToDOM = require('../lib/renderToDOM')
var renderToString = require('../lib/renderToString')
var jsdom = require('jsdom').jsdom
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var lastRenders = renderToDOM.lastRenders

describe('renderToDOM()', function () {
  it('will render virtual DOM, to the actual DOM', function () {
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var containerNode = document.getElementById('container')
    renderToDOM(Series(sampleData), containerNode, document)
    assert(lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will store virtual trees for diffing later', () => {
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var containerNode = document.getElementById('container')
    var firstVTree = Series(sampleData)
    var secondVTree = Series(assign({}, sampleData, { title: 'Untitled Series' }))
    assert(!lastRenders.has(containerNode))
    renderToDOM(firstVTree, containerNode, document)
    assert.equal(lastRenders.get(containerNode), firstVTree)
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(secondVTree, containerNode, document)
    assert.equal(lastRenders.get(containerNode), secondVTree)
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will patch onto a previously rendered dom', () => {
    var window = jsdom(`<div id="container">${renderToString(Series(assign({}, sampleData, { title: 'Untitled Series' })))}</div>`).defaultView
    var document = window.document
    var containerNode = document.getElementById('container')
    assert(!lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(Series(sampleData), containerNode, document)
    assert(lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })
})
