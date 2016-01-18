'use strict'

var h = require('virtual-dom/h')

function Book (data) {
  var volume = data.volume
  var title = data.title
  return (
    h('.book', [
      h('span.book--volume', 'Vol. ' + volume + ':'),
      ' ',
      h('span.book--title', title)
    ])
  )
}

module.exports = Book
