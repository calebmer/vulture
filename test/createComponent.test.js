var assert = require('assert')
var identity = require('lodash/identity')
var createComponent = require('../lib/createComponent')

describe('createComponent()', function () {
  it('will apply decorators in the correct order', function () {
    function addOne (component) {
      return function (value) {
        value = component(value)
        return value + 1
      }
    }

    function square (component) {
      return function (value) {
        value = component(value)
        return value * value
      }
    }

    assert.equal(createComponent(addOne, addOne, square, identity)(1), addOne(addOne(square(identity)))(1))
    assert.equal(createComponent(addOne, addOne, square, identity)(1), 3)
    assert.equal(createComponent(square, addOne, addOne, identity)(1), 9)
    assert.equal(createComponent(addOne, square, addOne, identity)(1), 5)
  })

  it('will set the component name to the last function’s name', function () {
    function MyComponent (value) {
      return value
    }

    var component = createComponent(identity, identity, MyComponent)

    assert.equal(component.name, 'MyComponent')
  })
})
