/**
 * Constructor based implementation of the `virtual-dom` widget contract.
 *
 * @constructor
 */

function Widget() {}

Widget.prototype.type = 'Widget'
Widget.prototype.init = function init() {}
Widget.prototype.update = function update() {}
Widget.prototype.destroy = function destroy() {}

module.exports = Widget
