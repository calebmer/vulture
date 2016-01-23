'use strict'

var toArray = require('lodash/toArray')

/**
 * The last argument is the component, all prior arguments are decorators for
 * that component. We decorate the component and then return it.
 *
 * @param {...function} All of the decorators to be appled.
 * @param {function} The component to be decorated.
 * @returns {function} The decorated component.
 */

function createComponent () {
  var decorators = toArray(arguments)
  var component = decorators.pop()

  // Apply all decorators.
  var decoratedComponent = (
    decorators
    .reverse()
    .reduce(function applyDecorator (currentComponent, decorator) {
      return decorator(currentComponent)
    }, component)
  )

  var finalComponent = function () {
    return decoratedComponent.apply(this, arguments)
  }

  if (Object.defineProperty && Object.getOwnPropertyDescriptor(finalComponent, 'name').configurable) {
    // Set the returned components name to the initial name.
    Object.defineProperty(finalComponent, 'name', {
      value: component.name,
      writable: false,
      enumerable: false,
      configurable: true
    })
  }

  return finalComponent
}

module.exports = createComponent
