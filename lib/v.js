'use strict'

var isString = require('lodash/isString')
var isPlainObject = require('lodash/isPlainObject')
var isArray = require('lodash/isArray')
var startsWith = require('lodash/startsWith')
var mapKeys = require('lodash/mapKeys')
var mapValues = require('lodash/mapValues')
var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')
var isVNode = require('virtual-dom/vnode/is-vnode')
var isVText = require('virtual-dom/vnode/is-vtext')
var isWidget = require('virtual-dom/vnode/is-widget')
var isVThunk = require('virtual-dom/vnode/is-thunk')
var EventHook = require('./EventHook')

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

  var key
  var namespace

  properties = mapKeys(properties, getAliasProperty)
  properties = mapValues(properties, maybeMakeEventHook)

  if (properties.key || properties.id) {
    key = properties.key || properties.id
    properties.key = undefined
  }

  if (properties.namespace) {
    namespace = properties.namespace
    properties.namespace = undefined
  }

  children = children.filter(validChild).map(transformChildToNode)

  return new VNode(tagName, properties, children, key, namespace)
}

module.exports = v

var propertyAliases = {
  'accept-charset': 'acceptCharset',
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function getAliasProperty (value, key) {
  return propertyAliases[key] || key
}

function maybeMakeEventHook (value, key) {
  if (startsWith(key, 'on')) {
    var event = key.substring(2).toLowerCase()
    return new EventHook(event, value)
  }
  return value
}

function validChild (child) {
  return child !== null && child !== undefined && child !== false
}

function isChild (child) {
  return isVNode(child) || isVText(child) || isWidget(child) || isVThunk(child)
}

function transformChildToNode (child) {
  if (isChild(child)) {
    return child
  } else {
    return new VText(String(child))
  }
}
