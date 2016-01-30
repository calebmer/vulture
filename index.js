'use strict'

var Vulture = require('./lib/v')

Vulture.v = require('./lib/v')
Vulture.makeLazy = require('./lib/makeLazy')
Vulture.applyState = require('./lib/applyState')
Vulture.createComponent = require('./lib/createComponent')

module.exports = Vulture
