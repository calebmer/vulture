var toArray = require('lodash/toArray')

/**
 * Takes all of the arguments and returns a thunk which will decorate the
 * thunk’s value with all of the initial arguments.
 *
 * This is a convenience function for building components.
 *
 * @param {...function} All of the decorators to be applied.
 * @returns {function} A thunk which when called will decorate the argument.
 */

function decorate () {
  var decorators = toArray(arguments).reverse()
  return function actuallyDecorate (value) {
    return decorators.reduce(function applyDecorator (currentValue, decorator) {
      return decorator(currentValue)
    }, value)
  }
}

module.exports = decorate
