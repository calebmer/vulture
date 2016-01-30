/**
 * Prototype interface for the virtual-dom hook contract.
 *
 * @constructor
 * @see https://github.com/Matt-Esch/virtual-dom/blob/master/docs/hooks.md
 */

function Hook () {}

Hook.prototype.hook = function hook () {}
Hook.prototype.unhook = function unhook () {}

module.exports = Hook
