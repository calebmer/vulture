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

  var decoratedComponent = decorators.reverse().reduce(function applyDecorator (currentComponent, decorator) {
    return decorator(currentComponent)
  }, component)

  return decoratedComponent
}

module.exports = createComponent
