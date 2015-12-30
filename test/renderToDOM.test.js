import assert from 'assert'
import renderToDOM, { lastRenders } from '../lib/renderToDOM'
import renderToString from '../lib/renderToString'
import { jsdom } from 'jsdom'
import Series, { seriesData } from './fixtures/Series'

describe('renderToDOM()', () => {
  it('will render virtual DOM, to the actual DOM', () => {
    const { defaultView: window } = jsdom('<div id="container"></div>')
    const { document } = window
    const containerNode = document.getElementById('container')
    renderToDOM(Series(seriesData), containerNode, document)
    assert(lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will store virtual trees for diffing later', () => {
    const { defaultView: window } = jsdom('<div id="container"></div>')
    const { document } = window
    const containerNode = document.getElementById('container')
    const firstVTree = Series(seriesData)
    const secondVTree = Series({ ...seriesData, title: 'Untitled Series' })
    assert(!lastRenders.has(containerNode))
    renderToDOM(firstVTree, containerNode, document)
    assert.equal(lastRenders.get(containerNode), firstVTree)
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(secondVTree, containerNode, document)
    assert.equal(lastRenders.get(containerNode), secondVTree)
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })

  it('will patch onto a previously rendered dom', () => {
    const { defaultView: window } = jsdom(`<div id="container">${renderToString(Series({ ...seriesData, title: 'Untitled Series' }))}</div>`)
    const { document } = window
    const containerNode = document.getElementById('container')
    assert(!lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Untitled Series</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
    renderToDOM(Series(seriesData), containerNode, document)
    assert(lastRenders.has(containerNode))
    assert.equal(containerNode.outerHTML, '<div id="container"><div class="series"><h1 class="series--title">Lord of the Rings</h1><p class="series--about">An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).</p><div class="series--books"><p>The books in the series are:</p><ul><li><div class="book"><span class="book--volume">Vol. 1:</span> <span class="book--title">The Fellowship of the Ring</span></div></li><li><div class="book"><span class="book--volume">Vol. 2:</span> <span class="book--title">The Two Towers</span></div></li><li><div class="book"><span class="book--volume">Vol. 3:</span> <span class="book--title">The Return of the King</span></div></li></ul></div></div></div>')
  })
})
