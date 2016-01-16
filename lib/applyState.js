'use strict'

var noop = require('lodash/utility/noop')
var isFunction = require('lodash/lang/isFunction')
var clone = require('lodash/lang/clone')
var assign = require('lodash/object/assign')
var diffNodes = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')

/**
 * Takes a renderer function and gives it stateful capabilities. This is useful
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
 * @param {function} The renderer function.
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
    // Bypass currying if the second argument is our renderer.
    return actuallyApplyState(arguments[1])
  }

  // Otherwise curry the function.
  return actuallyApplyState

  function actuallyApplyState (renderer) {
    return function render () {
      var self = this || {}
      var args = arguments

      return {
        type: 'Thunk',
        hook: new StateHook(),
        render: function renderThunk (previous) {
          var thunk = this
          var state = this.state = previous ? previous.state : clone(initialState)
          var hook = this.hook
          var rendering = false

          function setState (newState) {
            assign(state, newState)

            if (!rendering) {
              // If we are not rendering, we need to trigger a rerender.
              hook.update(thunk)
            } else {
              // If we are rendering, we should not rerender, but we should
              // update the cloned state object.
              assign(self.state, newState)
            }
          }

          // The developer must use `setState` to change the state so a rerender
          // may be triggered. Therefore we clone the state object.
          self.state = clone(state)
          self.setState = setState

          // Hooray for synchronous things.
          rendering = true
          var node = renderer.apply(self, args)
          rendering = false

          addHook(node, hook)

          return node
        }
      }
    }
  }
}

module.exports = applyState

/**
 * Adds a hook to a rendered node. This is a hacky way of adding a hook to a
 * thunk. See [this issue][vd343] for more information.
 *
 * [vd343]: https://github.com/Matt-Esch/virtual-dom/issues/343
 *
 * @private
 * @see applyState
 * @param {VNode} The node to add the hook to.
 * @param {Hook} The hook to be added.
 */

// TODO: Find a not so hacky way to do this.
function addHook (node, hook) {
  node.properties.__stateHook__ = hook
}

/**
 * A hook for specifically updating a stateful component.
 *
 * @private
 * @see applyState
 * @constructor
 */

function StateHook () {
  this.update = noop
}

/**
 * Sets the update method so that when it is called a DOM node is updated.
 *
 * @param {DOMNode} The DOM node to be updated when the state changes.
 */

StateHook.prototype.hook = function hook (node) {
  this.update = function update (thunk) {
    var lastVNode = thunk.vnode
    var nextVNode = thunk.render(thunk)
    var patches = diffNodes(lastVNode, nextVNode)
    patchDOM(node, patches)

    // Make sure the thunk has the most recent node to be diffed.
    thunk.vnode = nextVNode
  }
}

/**
 * Removes the update function.
 */

StateHook.prototype.unhook = function unhook () {
  this.update = noop
}
