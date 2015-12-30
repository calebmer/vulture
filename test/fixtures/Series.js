import { h } from 'virtual-dom'
import Book from './Book'

export default function Series({ title, about, books }) {
  return (
    h('.series', [
      h('h1.series--title', title),
      h('p.series--about', about),
      h('.series--books', [
        h('p', 'The books in the series are:'),
        h('ul', books.map(Book).map(book => h('li', book)))
      ])
    ])
  )
}

export const seriesData = {
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
