'use strict'

var noop = require('lodash/utility/noop')
var isFunction = require('lodash/lang/isFunction')
var clone = require('lodash/lang/clone')
var assign = require('lodash/object/assign')
var diffNodes = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')

// TODO: doc
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

// TODO: doc
// TODO: Find a not so hacky way to do this.
function addHook (node, hook) {
  node.properties.__stateHook__ = hook
}

// TODO: doc
function StateHook () {
  this.update = noop
}

// TODO: doc
StateHook.prototype.hook = function hook (node) {
  // TODO: add test for setting state in component render function, this is why we defer
  this.update = function update (thunk) {
    var lastVNode = thunk.vnode
    var nextVNode = thunk.render(thunk)
    var patches = diffNodes(lastVNode, nextVNode)
    patchDOM(node, patches)
    thunk.vnode = nextVNode
  }
}

// TODO: doc
StateHook.prototype.unhook = function unhook () {
  this.update = noop
}
