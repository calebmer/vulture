var assert = require('assert')
var jsdom = require('jsdom').jsdom
var EventHook = require('../lib/EventHook')

describe('EventHook', function () {
  it('attaches an event listener', function () {
    var calls = 0
    var hook = new EventHook('click', function () { calls += 1 })
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    hook.hook(document)
    document.dispatchEvent(new Event('click'))
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 2)
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 3)
  })

  it('dettaches an event listener', function () {
    var calls = 0
    var hook = new EventHook('click', function () { calls += 1 })
    var window = jsdom('<div id="container"></div>').defaultView
    var document = window.document
    var Event = window.Event
    hook.hook(document)
    document.dispatchEvent(new Event('click'))
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 2)
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 3)
    hook.unhook(document)
    document.dispatchEvent(new Event('click'))
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 3)
  })
})
