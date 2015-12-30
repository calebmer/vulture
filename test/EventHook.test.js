import assert from 'assert'
import { jsdom } from 'jsdom'
import EventHook from '../lib/EventHook'

describe('EventHook', () => {
  it('attaches an event listener', () => {
    let calls = 0
    const hook = new EventHook('click', () => calls += 1)
    const { defaultView: window } = jsdom('<div id="container"></div>')
    const { document, Event } = window
    hook.hook(document)
    document.dispatchEvent(new Event('click'))
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 2)
    document.dispatchEvent(new Event('click'))
    assert.equal(calls, 3)
  })

  it('dettaches an event listener', () => {
    let calls = 0
    const hook = new EventHook('click', () => calls += 1)
    const { defaultView: window } = jsdom('<div id="container"></div>')
    const { document, Event } = window
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
