var Vulture = require('./lib/v')

Vulture.v = require('./lib/v')
Vulture.map = require('./lib/map')
Vulture.forEach = require('./lib/forEach')
Vulture.reduce = require('./lib/reduce')
Vulture.VNode = require('virtual-dom/vnode/vnode')
Vulture.VText = require('virtual-dom/vnode/vtext')
Vulture.Hook = require('./lib/Hook')
Vulture.Thunk = require('./lib/Thunk')
Vulture.Widget = require('./lib/Widget')
Vulture.EventHook = require('./lib/EventHook')

module.exports = Vulture
