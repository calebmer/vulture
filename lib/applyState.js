'use strict'

var isFunction = require('lodash/isFunction')
var StateThunk = require('./StateThunk')

/**
 * Takes a component function and gives it stateful capabilities. This is useful
 * for developing components which need a local state object that isn’t
 * critical if that state is not persisted.
 *
 * By using this function, the passed render method will obtain two properties
 * in it‘s `this` variable. The values are `this.state` and `this.setState`.
 * `this.state` contains the state key/values and `this.setState` updates the
 * `this.state` object and triggers a rerender. `this.state` should not be
 * directly modifyied, modifications should allways be done by `this.setState`.
 *
 * This function may be curried.
 *
 * @param {object?} An optional initial state object.
 * @param {function} The component function.
 * @returns {Thunk} A thunk which persists the state.
 */

function applyState () {
  var initialState = {}

  if (isFunction(arguments[0])) {
    // Bypass currying if no initial state was set.
    return actuallyApplyState(arguments[0])
  }

  // Get the initial state which we can assume is the first argument.
  initialState = arguments[0] || {}

  if (isFunction(arguments[1])) {
    // Bypass currying if the second argument is our component.
    return actuallyApplyState(arguments[1])
  }

  // Otherwise curry the function.
  return actuallyApplyState

  function actuallyApplyState (component) {
    return function render () {
      var self = this || {}
      var args = arguments

      function renderer () {
        self.state = this.state
        self.setState = this.setState.bind(this)
        self.resetState = this.resetState.bind(this)
        return component.apply(self, args)
      }

      return new StateThunk(renderer, initialState)
    }
  }
}

module.exports = applyState
