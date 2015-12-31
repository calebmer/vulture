var v = require('./lib/v')

v.VNode = require('virtual-dom/vnode/vnode')
v.VText = require('virtual-dom/vnode/vtext')
v.Hook = require('./lib/Hook')
v.Thunk = require('./lib/Thunk')
v.Widget = require('./lib/Widget')

module.exports = v
