'use strict'

var isString = require('lodash/isString')
var isPlainObject = require('lodash/isPlainObject')
var isArray = require('lodash/isArray')
var startsWith = require('lodash/startsWith')
var flatten = require('lodash/flatten')
var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')
var isVNode = require('virtual-dom/vnode/is-vnode')
var isVText = require('virtual-dom/vnode/is-vtext')
var isWidget = require('virtual-dom/vnode/is-widget')
var isVThunk = require('virtual-dom/vnode/is-thunk')
var EventHook = require('./EventHook')
var HardSetHook = require('./HardSetHook')

var propertyAliases = {
  'accept-charset': 'acceptCharset',
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

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
  var attributes
  var transformedProperties = {}

  for (var property in properties) {
    var value = properties[property]

    if (property === 'key') {
      key = value
      continue
    }

    if (property === 'namespace') {
      namespace = value
      continue
    }

    if (property === 'value') {
      // We want to hard set the value property to bypass the virual dom
      // diffing. For example, if in a diff the `a` node and the `b` node both
      // have the same value if the value has been changed between `a` and `b`
      // the value will not be updated. This hook fixes that bug.
      transformedProperties.value = new HardSetHook(value)
      continue
    }

    if (startsWith(property, 'on')) {
      var event = property.substring(2).toLowerCase()
      transformedProperties[property] = new EventHook(event, value)
      continue
    }

    // TODO: When considering breaking changes, test the performance w/ and
    // w/o this. There might be a more performant solution.
    if (startsWith(property, 'aria-') || startsWith(property, 'data-')) {
      if (!attributes) {
        attributes = {}
      }
      attributes[property] = value
      continue
    }

    property = propertyAliases[property] || property
    transformedProperties[property] = value
  }

  if (!key && transformedProperties.id) {
    key = transformedProperties.id
  }

  if (attributes) {
    transformedProperties.attributes = attributes
  }

  children = flatten(children).filter(truthyChild).map(transformChildToNode)

  return new VNode(tagName, transformedProperties, children, key, namespace)
}

module.exports = v

function truthyChild (child) {
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
