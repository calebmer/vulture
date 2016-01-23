'use strict'

/**
 * Turns a function which returns a virtual dom into a lazy thunk. If the
 * function has a `this` context, the function will not be lazified.
 *
 * @param {function} The function to be lazified.
 * @returns {function} The lazified function.
 */

function makeLazy (component) {
  return function lazifiedComponent () {
    var self = this
    var args = arguments

    // If there is `this` there is also a possibility for side effects.
    // Therefore we should just return the virtual tree.
    if (self) {
      return component.apply(self, args)
    }

    return {
      type: 'Thunk',
      args: args,
      render: function render (previous) {
        // If the arguments are shallowly equal to one another, and the
        // previous render wasn‘t a thunk then return the saved virtual node.
        if (previous && compareArgs(args, previous.args)) {
          return previous.vnode
        }

        return component.apply(self, args)
      }
    }
  }
}

module.exports = makeLazy

/**
 * Takes two sets of arguments and compares their values. This is used to see
 * if the lazy function should update or not.
 *
 * @private
 * @see makeLazy
 * @param {Array} The first set of arguments.
 * @param {Array} The second set of arguments.
 * @returns {boolean} Whether or not the two argument sets are not equal.
 */

function compareArgs (argsA, argsB) {
  if (!argsA || !argsB) {
    return false
  }

  if (argsA.length !== argsB.length) {
    return false
  }

  for (var i = 0, max = argsA.length; i < max; i++) {
    if (!shallowEqual(argsA[i], argsB[i])) {
      return false
    }
  }

  return true
}

/**
 * Compares two values to each other an sees if the shallowly equal one
 * another.
 *
 * @private
 * @see compareArgs
 * @param {any} The first value.
 * @param {any} The second value.
 * @returns {boolean} Whether or not they are shallowly equal.
 */

function shallowEqual (valueA, valueB) {
  if (valueA === valueB) {
    return true
  }

  if (typeof valueA !== 'object' || typeof valueB !== 'object' || valueA === null || valueB === null) {
    return false
  }

  var keysA = Object.keys(valueA)
  var keysB = Object.keys(valueB)

  for (var i = 0, max = keysA.length; i < max; i++) {
    if (keysA[i] !== keysB[i]) {
      return false
    }
  }

  return true
}
