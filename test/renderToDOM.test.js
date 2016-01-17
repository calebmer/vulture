var assert = require('assert')
var assign = require('lodash/assign')
var jsdom = require('jsdom').jsdom
var h = require('virtual-dom/h')
var renderToDOM = require('../lib/renderToDOM')
var renderToString = require('../lib/renderToString')
var EventHook = require('../lib/EventHook')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData
var lastRenders = renderToDOM.lastRenders

describe('renderToDOM()', function () {
  it('will render virtual DOM, to the actual DOM', function () {
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var container = document.getElementById('container')
    renderToDOM(Series(sampleData), container, document)
    assert(lastRenders.has(container))
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will store virtual trees for diffing later', () => {
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var container = document.getElementById('container')
    var firstVTree = Series(sampleData)
    var secondVTree = Series(assign({}, sampleData, { title: 'Untitled Series' }))
    assert(!lastRenders.has(container))
    renderToDOM(firstVTree, container, document)
    assert.equal(lastRenders.get(container), firstVTree)
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(secondVTree, container, document)
    assert.equal(lastRenders.get(container), secondVTree)
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will replace a previously rendered dom', () => {
    var window = jsdom(`<div id="container">${renderToString(Series(assign({}, sampleData, { title: 'Untitled Series' })))}</div>`).defaultView
    var document = window.document
    var container = document.getElementById('container')
    var lastNode = container.firstElementChild
    assert(!lastRenders.has(container))
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(Series(sampleData), container, document)
    assert.notEqual(container.firstElementChild, lastNode)
    lastNode = container.firstElementChild
    assert(lastRenders.has(container))
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(Series(assign({}, sampleData, { title: 'Untitled Series' })), container, document)
    assert.equal(container.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    assert.equal(container.firstElementChild, lastNode)
  })

  it('doesn’t break event hooks', () => {
    var clicks = 0

    function render(text) {
      return h('div',
        { onClick: new EventHook('click', () => clicks += 1) },
        [text]
      )
    }

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var click = () => container.firstElementChild.dispatchEvent(new Event('click'))

    renderToDOM(render('hello'), container, document)
    assert.equal(clicks, 0)
    click()
    assert.equal(clicks, 1)
    click()
    click()
    click()
    assert.equal(clicks, 4)
    renderToDOM(render('goodbye'), container, document)
    click()
    assert.equal(clicks, 5)
    click()
    click()
    click()
    assert.equal(clicks, 8)
  })
})
