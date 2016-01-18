var Vulture = require('./lib/v')

Vulture.v = require('./lib/v')
Vulture.renderToDOM = require('./lib/renderToDOM')
Vulture.render = require('./lib/renderToDOM')
Vulture.createComponent = require('./lib/createComponent')
Vulture.applyState = require('./lib/applyState')
Vulture.map = require('./lib/map')
Vulture.forEach = require('./lib/forEach')
Vulture.reduce = require('./lib/reduce')

Vulture.decorate = require('./lib/deprecated/decorate')
Vulture.lazy = require('./lib/deprecated/lazy')

module.exports = Vulture
