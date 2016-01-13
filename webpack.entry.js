var assign = require('lodash/object/assign')

var Vulture = require('./lib/v')

assign(
  Vulture,
  require('./dom'),
  require('./utils')
)

module.exports = Vulture
