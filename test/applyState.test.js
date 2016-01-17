var assert = require('assert')
var isObject = require('lodash/isObject')
var isFunction = require('lodash/isFunction')
var wrap = require('lodash/wrap')
var jsdom = require('jsdom').jsdom
var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element')
var diffNodes = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')
var applyState = require('../lib/applyState')
var EventHook = require('../lib/EventHook')
var Series = require('./fixtures/Series')

var sampleData = Series.sampleData

describe('applyState()', () => {
  it('will return a thunk', () => {
    var SeriesWithState = applyState(Series)
    assert.equal(SeriesWithState(sampleData).type, 'Thunk')
  })

  it('will render as normal', () => {
    var SeriesWithState = applyState(Series)
    var node = SeriesWithState(sampleData).render()
    delete node.properties.__stateHook__
    assert.deepEqual(node, Series(sampleData))
  })

  it('will add properties to this', done => {
    var stateRender = applyState(function render() {
      assert(isObject(this.state))
      assert(isFunction(this.setState))
      done()
      return h()
    })

    stateRender().render()
  })

  it('will not override properties on this if provided', done => {
    var object = { a: 1, b: 2 }

    var stateRender = wrap(applyState(function render() {
      assert.equal(this.object, object)
      assert(isObject(this.state))
      assert(isFunction(this.setState))
      done()
      return h()
    }), func => func.call({ object: object }))

    stateRender().render()
  })

  it('will get the right arguments', done => {
    var objectA = { a: 1 }
    var objectB = { b: 2 }

    var stateRender = applyState(function render(a, b) {
      assert.equal(a, objectA)
      assert.equal(b, objectB)
      done()
      return h()
    })

    stateRender(objectA, objectB).render()
  })

  it('can be given an initial state', done => {
    var initialState = { a: 1, b: 2 }

    var stateRender = applyState(initialState, function render() {
      assert.notEqual(this.state, initialState)
      assert.deepEqual(this.state, initialState)
      done()
      return h()
    })

    stateRender().render()
  })

  it('can be curried', done => {
    var initialState = { a: 1, b: 2 }

    var stateRender = applyState(initialState)(function render() {
      assert.notEqual(this.state, initialState)
      assert.deepEqual(this.state, initialState)
      done()
      return h()
    })

    stateRender().render()
  })

  it('will update a component when state is changed', () => {
    var stateRender = applyState({ clicks: 0 }, function render() {
      return h('div',
        { onClick: new EventHook('click', () => this.setState({ clicks: this.state.clicks + 1 })) },
        [`Clicks: ${this.state.clicks}`]
      )
    })

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var node = createElement(stateRender(), { document: document })
    container.appendChild(node)
    assert.equal(node.innerHTML, 'Clicks: 0')
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 1')
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 4')
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 5')
  })

  it('can set state in the render method', () => {
    var stateRender = applyState({ clicks: 0, renders: 0 }, function render() {
      var initialRenders = this.state.renders
      this.setState({ renders: this.state.renders + 1 })
      assert.equal(this.state.renders, initialRenders + 1)

      return h('div',
        { onClick: new EventHook('click', () => this.setState({ clicks: this.state.clicks + 1 })) },
        [
          `Clicks: ${this.state.clicks}`,
          h('br'),
          `Renders: ${this.state.renders}`
        ]
      )
    })

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var node = createElement(stateRender(), { document: document })
    container.appendChild(node)
    assert.equal(node.innerHTML, 'Clicks: 0<br>Renders: 1')
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 1<br>Renders: 2')
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 4<br>Renders: 5')
    node.dispatchEvent(new Event('click'))
    assert.equal(node.innerHTML, 'Clicks: 5<br>Renders: 6')
  })

  it('will not update when modifying the state object', () => {
    var renders = 0

    var stateRender = applyState({ clicks: 0 }, function render() {
      renders += 1
      return h('div',
        { onClick: new EventHook('click', () => this.state.clicks = this.state.clicks + 1) },
        [`Clicks: ${this.state.clicks}`]
      )
    })

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var node = createElement(stateRender(), { document: document })
    container.appendChild(node)
    assert.equal(renders, 1)
    assert.equal(node.innerHTML, 'Clicks: 0')
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    node.dispatchEvent(new Event('click'))
    assert.equal(renders, 1)
    assert.equal(node.innerHTML, 'Clicks: 0')
  })

  it('will update component state independently', () => {
    var count = 0

    var stateRender = applyState({ clicks: 0 }, function render() {
      return h('div',
        { onClick: new EventHook('click', () => this.setState({ clicks: this.state.clicks + 1 })) },
        [`Clicks: ${this.state.clicks}`]
      )
    })

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var nodeA = createElement(stateRender(), { document: document })
    var nodeB = createElement(stateRender(), { document: document })
    container.appendChild(nodeA)
    container.appendChild(nodeB)
    assert.equal(nodeA.innerHTML, 'Clicks: 0')
    assert.equal(nodeB.innerHTML, 'Clicks: 0')
    nodeA.dispatchEvent(new Event('click'))
    assert.equal(nodeA.innerHTML, 'Clicks: 1')
    assert.equal(nodeB.innerHTML, 'Clicks: 0')
    nodeB.dispatchEvent(new Event('click'))
    assert.equal(nodeA.innerHTML, 'Clicks: 1')
    assert.equal(nodeB.innerHTML, 'Clicks: 1')
    nodeA.dispatchEvent(new Event('click'))
    nodeA.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    assert.equal(nodeA.innerHTML, 'Clicks: 3')
    assert.equal(nodeB.innerHTML, 'Clicks: 5')
  })

  it('will update and maintain state across diff/patches', () => {
    var stateRender = applyState({ clicks: 0 }, function render(id) {
      return h('div',
        { id: id, onClick: new EventHook('click', () => this.setState({ clicks: this.state.clicks + 1 })) },
        [`Clicks: ${this.state.clicks}`]
      )
    })

    function renderContainer(text) {
      return h('div', {}, [
        text,
        stateRender('node-a'),
        stateRender('node-b')
      ])
    }

    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    var container = document.getElementById('container')
    var firstVNode = renderContainer('hello')
    var secondVNode = renderContainer('goodbye')
    var thirdVNode = renderContainer('hello')
    var nodesContainer = createElement(firstVNode, { document: document })
    container.appendChild(nodesContainer)
    var nodeA = document.getElementById('node-a')
    var nodeB = document.getElementById('node-b')
    assert.equal(container.innerHTML, '<div>hello<div id="node-a">Clicks: 0</div><div id="node-b">Clicks: 0</div></div>')
    nodeA.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    nodeA.dispatchEvent(new Event('click'))
    assert.equal(container.innerHTML, '<div>hello<div id="node-a">Clicks: 2</div><div id="node-b">Clicks: 1</div></div>')
    var patches = diffNodes(firstVNode, secondVNode)
    patchDOM(nodesContainer, patches)
    assert.equal(container.innerHTML, '<div>goodbye<div id="node-a">Clicks: 2</div><div id="node-b">Clicks: 1</div></div>')
    nodeB.dispatchEvent(new Event('click'))
    nodeA.dispatchEvent(new Event('click'))
    nodeB.dispatchEvent(new Event('click'))
    assert.equal(container.innerHTML, '<div>goodbye<div id="node-a">Clicks: 3</div><div id="node-b">Clicks: 3</div></div>')
    patches = diffNodes(secondVNode, thirdVNode)
    patchDOM(nodesContainer, patches)
    assert.equal(container.innerHTML, '<div>hello<div id="node-a">Clicks: 3</div><div id="node-b">Clicks: 3</div></div>')
    nodeA.dispatchEvent(new Event('click'))
    assert.equal(container.innerHTML, '<div>hello<div id="node-a">Clicks: 4</div><div id="node-b">Clicks: 3</div></div>')
  })
})
