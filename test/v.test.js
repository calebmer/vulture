import assert from 'assert'
import { h, VNode } from 'virtual-dom'
import v from '../lib/v'
import EventHook from '../lib/EventHook'
import Series, { seriesData } from './fixtures/series'

describe('v()', () => {
  it('accepts a parameter rest as the children parameter', () => {
    const children = [h('div'), h('p'), h('blockquote')]
    assert.deepEqual(v('div', {}, ...children).children, children)
    assert.deepEqual(v('div', ...children).children, children)
  })

  it('will call a function', () =>
    assert.deepEqual(v(Series, seriesData), Series(seriesData))
  )

  it('will call a function with children', () => {
    const children = [h('div'), h('p'), h('blockquote')]
    const component = (properties, children) => children
    assert.equal(v(component, children), children)
  })

  it('works with jsx', () => {
    const Page = require('./fixtures/Page').default
    assert(Page instanceof VNode)
    assert.equal(Page.tagName, 'HTML')
    assert.deepEqual(Page.properties, { lang: 'en' })
    assert.equal(Page.children.length, 2)
  })

  it('turns special properties into event hooks', () => {
    const id = value => value
    const vnode = v('div', {
      click: id,
      onClick: id,
      onTap: id,
      onMouseOver: id,
      onWhatever: id
    })

    assert(!(vnode.properties.click instanceof EventHook))
    assert(vnode.properties.onClick instanceof EventHook)
    assert.equal(vnode.properties.onClick.event, 'click')
    assert.equal(vnode.properties.onClick.listener, id)
    assert(vnode.properties.onTap instanceof EventHook)
    assert.equal(vnode.properties.onTap.event, 'tap')
    assert(vnode.properties.onMouseOver instanceof EventHook)
    assert.equal(vnode.properties.onMouseOver.event, 'mouseover')
    assert(vnode.properties.onWhatever instanceof EventHook)
    assert.equal(vnode.properties.onWhatever.event, 'whatever')
  })

  it('aliases common attribute names', () => {
    const vnode = v('div', {
      class: 'a',
      for: 'b'
    })

    assert.equal(vnode.properties.className, 'a')
    assert.equal(vnode.properties.htmlFor, 'b')
  })
})
