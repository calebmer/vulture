'use strict'

/**
 * Prototype interface for the virtual-dom thunk contract.
 *
 * @constructor
 * @see https://github.com/Matt-Esch/virtual-dom/blob/master/docs/thunk.md
 */

function Thunk () {}

Thunk.prototype.type = 'Thunk'
Thunk.prototype.render = function render () {}

module.exports = Thunk
