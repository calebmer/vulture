var assert = require('assert')
var decorate = require('../lib/deprecated/decorate')

describe('decorate()', () => {
  it('will apply decorators in the correct order', () => {
    function addOne(value) {
      return value + 1
    }

    function square(value) {
      return value * value
    }

    assert.equal(decorate(addOne, addOne, square)(1), addOne(addOne(square(1))))
    assert.equal(decorate(addOne, addOne, square)(1), 3)
    assert.equal(decorate(square, addOne, addOne)(1), 9)
    assert.equal(decorate(addOne, square, addOne)(1), 5)
  })
})
