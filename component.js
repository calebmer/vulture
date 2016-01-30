// DEPRECARED

'use strict'

var Vulture = require('./lib/createComponent')

Vulture.applyState = require('./lib/applyState')
Vulture.createComponent = require('./lib/createComponent')

Vulture.makeLazy = require('./lib/makeLazy')
Vulture.decorate = require('./lib/deprecated/decorate')
Vulture.lazy = require('./lib/deprecated/lazy')

module.exports = Vulture
