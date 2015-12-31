var v = require('./lib/v')

v.v = v
v.map = require('./lib/map')
v.forEach = require('./lib/forEach')
v.reduce = require('./lib/reduce')
v.VNode = require('virtual-dom/vnode/vnode')
v.VText = require('virtual-dom/vnode/vtext')
v.Hook = require('./lib/Hook')
v.Thunk = require('./lib/Thunk')
v.Widget = require('./lib/Widget')
v.EventHook = require('./lib/EventHook')

module.exports = v
