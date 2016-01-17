'use strict'

var isString = require('lodash/lang/isString')
var isPlainObject = require('lodash/lang/isPlainObject')
var isArray = require('lodash/lang/isArray')
var clone = require('lodash/lang/clone')
var startsWith = require('lodash/string/startsWith')
var mapKeys = require('lodash/object/mapKeys')
var mapValues = require('lodash/object/mapValues')
var compose = require('lodash/function/compose')
var h = require('virtual-dom/h')
var EventHook = require('./EventHook')

var transformVDOMProperties = compose(idToKey, fixAliases, addEventHooks)

/**
 * Vulture hyperscript implementation for use with JSX. It accepts children as
 * a rest parameter or as an array.
 *
 * If the `tagName` is a function, than we execute the function with
 * `properties` and `children` as parameters.
 *
 * @param {string|function} The tag of the element.
 * @param {object} Properties for the element.
 * @param {Array} The element's children.
 * @return {VNode} The created element.
 */

function v (tagName, properties, children) {
  if (!isString(tagName)) {
    children = properties
    properties = tagName
    tagName = 'div'
  }

  if (!isPlainObject(properties)) {
    children = properties
    properties = {}
  }

  if (!isArray(children)) {
    children = [children]
  }

  return h(tagName, transformVDOMProperties(properties), children)
}

module.exports = v

/**
 * Replaces all on* strings with event hooks of the same name. For example
 * `onClick` will turn into a `click` event hook.
 *
 * @private
 * @see v
 * @param {object} The original properties object.
 * @returns {object} The hooked properties object.
 */

function addEventHooks (properties) {
  return mapValues(properties, function (value, key) {
    if (startsWith(key, 'on')) {
      var event = key.substring(2).toLowerCase()
      return new EventHook(event, value)
    }
    return value
  })
}

/**
 * There are some property aliases for common properties we would like to
 * support.
 *
 * @private
 * @see v
 * @param {object} The original properties object.
 * @returns {object} The aliased property object.
 */

var propertyAliases = {
  'accept-charset': 'acceptCharset',
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function fixAliases (properties) {
  return mapKeys(properties, function (value, key) {
    return propertyAliases[key] || key
  })
}

/**
 * If the user set an id, make sure that id is also the key.
 *
 * @private
 * @see v
 * @param {object} The original properties object.
 * @returns {object} The property where key is now id.
 */

function idToKey (origProperties) {
  var properties = clone(origProperties)

  if (properties.id && !properties.key) {
    properties.key = properties.id
  }

  return properties
}
