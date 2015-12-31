# vulture
`vulture` is a front-end framework optimized for progressive enhancement and accessibility. Everything rendered with `vulture` *must* be accessible for everyone, even those who have chosen to disable JavaScript.

To accomplish this goal, `vulture` uses the concept of isomorphism, shared code on both the client and server. Therefore (while not required) it is highly recommended that your web app server (sometimes lovingly called the front-end-back-end) use node.js.

```js
var v = require('vulture')
var render = require('vulture/dom')

render(v('p', 'Hello, world!'))
```

## Strengths
- Blazing fast. The virtual DOM is super efficient as it allows for micro diffing and patching of the rendered DOM.
- Isomorphic. `vulture` can easily go through an initial server render, and state is handled in such a way that it may be easily communicated across page visits.
- Small. With one of the smallest file sizes of any front-end framework, `vulture` will *not* get in your way. Finally there is a front-end framework which is not a behemoth for users to download.
- Traversable virtual DOM. Other virtual DOM implementations like ReactJS are not easily traversable, `vulture`‘s virtual DOM output *is*. This allows for a wide range of tooling which just wasn’t possible when using ReactJS.

## Components
At it’s core, `vulture` is just an advanced virtual DOM rendering library. Therefore it’s components are completely user defined.

```js
var v = require('vulture')

function StarButton(data) {
  var isStarred = data.isStarred
  var target = data.target
  return (
    v('button',
      { class: [isStarred ? 'is-starred' : null] },
      (isStarred ? 'Starred' : 'Star') + ' ' + target)
	)
}

module.exports = StarButton
```

The above snippet is the minimum you need for a component. No compiler, no class, no objects, just a plain function which you have *complete* control over. The only thing you need is the `v` function which is a helper for creating virtual DOM nodes.

To use the component is even easier.

```js
var v = require('vulture')
var ButtonStar = require('./ButtonStar')

function Person(data) {
  var firstName = data.firstName
  var lastName = data.lastName
  var about = data.about
  var isStarred = data.isStarred
  return (
    v('article', [
      v('h1', firstName + ' ' + lastName),
      StarButton({
        target: firstName,
        isStarred: isStarred
      })
    ])
  )
}

module.exports = Person
```

Because our components are *just* functions, we can call them as such.

This also means that our rendered virtual DOM trees are not lazy as they are in ReactJS. Allowing you to traverse the full virtual DOM and apply transformations as you will.

## Library or Framework?
In API, `vulture` is really more of a library then a framework. However, with  the entire `vulture` ecosystem, you can easily replace your front-end framework with vulture. The ecosystem and mindset used when developing with `vulture` is what makes it a framework.

## State
There is no default way to handle state in vulture, this is because HTTP is intrinsically stateless. Furthermore, any state you might have must be global to a virtual DOM tree.

For a state implementation, see:

- `vulture-redux`: TODO.
- `vulture-observable`: TODO.

## API
TODO.
