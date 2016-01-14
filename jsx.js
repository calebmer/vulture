var v = require('./lib/v')

function jsx (jsxObject) {
  return v(
    jsxObject.elementName,
    jsxObject.attributes,
    jsxObject.children
  )
}

module.exports = jsx
