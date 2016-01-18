'use strict'

var h = require('virtual-dom/h')
var Book = require('./Book')

function Series (data) {
  var title = data.title
  var about = data.about
  var books = data.books
  return (
    h('.series', [
      h('h1.series--title', title),
      h('p.series--about', about),
      h('.series--books', [
        h('p', 'The books in the series are:'),
        h('ul', books.map(Book).map(function (book) { return h('li', book) }))
      ])
    ])
  )
}

var sampleData = {
  title: 'Lord of the Rings',
  about: 'An English-language fictional trilogy by J. R. R. Tolkien (1892-1973).',
  books: [
    {
      volume: 1,
      title: 'The Fellowship of the Ring'
    },
    {
      volume: 2,
      title: 'The Two Towers'
    },
    {
      volume: 3,
      title: 'The Return of the King'
    }
  ]
}

var mapOrder = [
  'div', 'h1', 'p', 'div',
  'p', 'ul', 'li', 'div',
  'span', 'span', 'li', 'div',
  'span', 'span', 'li', 'div',
  'span', 'span'
]

Series.sampleData = sampleData
Series.mapOrder = mapOrder
module.exports = Series
