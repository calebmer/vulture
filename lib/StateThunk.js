'use strict'

var assign = require('lodash/assign')
var clone = require('lodash/clone')
var UpdatableThunk = require('./UpdatableThunk')

/**
 * A thunk which has some state attached to it.
 *
 * @constructor
 * @extends UpdatableThunk
 * @param {function} The function to be used in rendering.
 * @param {object} The optional initial state.
 */

function StateThunk (renderer, initialState) {
  if (!(this instanceof StateThunk)) {
    return new StateThunk(renderer)
  }

  UpdatableThunk.call(this, renderer)

  this.initialState = initialState || {}
  this.state = null
}

StateThunk.prototype = Object.create(UpdatableThunk.prototype)

/**
 * Updates the state object and then updates the thunk.
 *
 * @method
 * @param {object} New state partial. Will be assigned into the state.
 */

StateThunk.prototype.setState = function setState (newState) {
  if (!this.state) {
    return
  }

  assign(this.state, newState)
  this.update()
}

StateThunk.prototype.render = function render (previous) {
  this.state = previous && previous.state ? previous.state : clone(this.initialState)
  return UpdatableThunk.prototype.render.call(this, previous)
}

module.exports = StateThunk
