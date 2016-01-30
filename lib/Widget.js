/**
 * Prototype interface for the virtual-dom widget contract.
 *
 * @constructor
 * @see https://github.com/Matt-Esch/virtual-dom/blob/master/docs/widget.md
 */

function Widget () {}

Widget.prototype.type = 'Widget'
Widget.prototype.init = function init () {}
Widget.prototype.update = function () {}
Widget.prototype.destroy = function () {}

module.exports = Widget
