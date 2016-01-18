var clone = require('lodash/clone')
var assert = require('assert')
var makeLazy = require('../lib/makeLazy')
var Series = require('./fixtures/series')

var sampleData = Series.sampleData

describe('makeLazy()', function () {
  it('will return the exact same vdom if nothing changed', function () {
    var SeriesLazy = makeLazy(Series)
    var firstThunk = SeriesLazy(sampleData)
    var secondThunk = SeriesLazy(sampleData)
    var thirdThunk = SeriesLazy(clone(sampleData))
    var firstRender = firstThunk.render()
    firstThunk.vnode = firstRender
    assert.equal(firstRender, firstThunk.render(firstThunk))
    assert.equal(firstRender, secondThunk.render(firstThunk))
    assert.equal(firstRender, thirdThunk.render(firstThunk))
  })
})
