# vulture

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

`vulture` is a front-end framework optimized for progressive enhancement and accessibility. Everything rendered with `vulture` *must* be accessible for everyone, even those who have chosen to disable JavaScript.

To accomplish this goal, `vulture` uses the concept of isomorphism, shared code on both the client and server. However, in order to be isomorphic `vulture` uses a virtual DOM (specifically the [`virtual-dom`](http://npmjs.com/virtual-dom) package). This inevitably means writing HTML in JavaScript.

```js
var v = require('vulture')
var render = require('vulture/dom')

render(v('p', 'Hello, world!'))
```

”Isn‘t that the opposite of progressive enhancement?” some may claim, but keep an open mind. The answer is not at all. There are different techniques for achieving a progressively enhanced web app, `vulture` just takes a more modern one.

Writing HTML in JavaScript gives a couple of acute benefits. First, the DOM can be constructed *everywhere*. Whether it be on the server, client, service worker, or refrigerator. Second, it‘s super easy to script in your templates. After all, it‘s just JavaScript! Third, we can run checks on your DOM for accessibility, semanticity, and more really simply.

For those who want a more HTML like syntax, JSX is an enhancement. For more information see [here](#jsx). The above example would instead be this:

```jsx
var v = require('vulture')
var render = require('vulture/dom')

render(<p>Hello, world!</p>)
```

## Strengths
- **Small**. With one of the smallest file sizes of any front-end framework, `vulture` will *not* get in your way. Finally there is a front-end framework which is not a behemoth for users to download.
- Blazing fast. The virtual DOM is super efficient as it allows for micro diffing and patching of the rendered DOM.
- Isomorphic. `vulture` can easily go through an initial server render, and state is handled in such a way that it may be easily communicated across page visits. Whether it be the client, server, service worker, or even refrigerator, `vulture` can run.
- Traversable virtual DOM. Other virtual DOM implementations like ReactJS are not easily traversable, `vulture`‘s virtual DOM output *is*. This allows for a wide range of tooling which just wasn’t possible when using ReactJS.

## Library or Framework?
In API, `vulture` is really more of a library then a framework. However, with  the entire `vulture` ecosystem, you can easily replace your front-end framework with vulture. The ecosystem and mindset used when developing with `vulture` is what makes it a framework.

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
      ButtonStar({
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

### State
TODO

## JSX
To use with JSX, first install [this](https://www.npmjs.com/package/babel-plugin-transform-jsx) JSX babel plugin by running:

```bash
$ npm install --save babel-plugin-transform-jsx
```

And then add the following to your `.babelrc` file:

```json
{
  "plugins": [
    ["transform-jsx", { "module": "vulture/jsx" }]
  ]
}
```

That’s it! Unlike ReactJS, you don‘t need to `require` or `import` the `vulture` module in every file. If you are using JSX the plugin will know and add an appropriate `import` statement. Just remember to transform ES6 modules.

## API
### v(tagName? = 'div', properties? = {}, children?)
This will create a new virtual DOM node using the parameters. You can generally throw anything at this function and it will work. For example:

```js
v('div', [v('p', 'Hello, world!')])
```

Would actually be like calling:

```js
v('div', {}, [v('p', {}, ['Hello, world!'])])
```

If you are using JSX you should never really need this function.

For more information on what is returned, see the [`virtual-dom`](https://www.npmjs.com/package/virtual-dom) documentation.

- `tagName`: The tag name string to be used. The standard stuff: `div`, `h1`, `p`, `input`, and on.
- `properties`: An object of key/value properties. Can be considered as properties on the DOM node, or DOM attributes.
- `children`: An array (or single value) of any type. Represents the children of the node.

### renderToString
TODO

### renderToDOM
TODO

### applyState
TODO

### map
TODO

### forEach
TODO

### reduce
TODO
