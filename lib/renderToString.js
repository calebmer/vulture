'use strict'

var isArray = require('lodash/lang/isArray')
var toHTML = require('vdom-to-html')

/**
 * Takes a virtual node and renders it to an HTML string. If the first
 * parameter is an array, render all of its items individually.
 *
 * @param {VNode} The virtual node to render.
 * @returns {string} The markup string.
 */

function renderToString (vTree) {
  if (isArray(vTree)) {
    return vTree.map(renderToString).join('')
  }

  return toHTML(vTree)
}

module.exports = renderToString
