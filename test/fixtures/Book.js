import { h } from 'virtual-dom'

export default function Book({ volume, title }) {
  return (
    h('.book', [
      h('span.book--volume', `Vol. ${volume}:`),
      ' ',
      h('span.book--title', title)
    ])
  )
}
