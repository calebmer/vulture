'use strict'

// TODO: doc
function makeLazy (component) {
  return function lazifiedComponent () {
    var self = this
    var args = arguments
    return {
      type: 'Thunk',
      args: args,
      render: function render (previous) {
        if (previous && compareArgs(args, previous.args)) {
          return previous.vnode
        }

        var vnode = component.apply(self, args)

        if (vnode.type === 'Thunk') {
          throw new Error(
            (component.name || 'anonymous function') + ' cannot be lazified because it returns a Thunk'
          )
        }

        return vnode
      }
    }
  }
}

module.exports = makeLazy

// TODO: doc
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

// TODO: doc
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
