# Vulture
> **TL;DR**, Vulture is cool because promises/observables are valid JSX nodes and renderers are written as reducers.

Vulture is an expiremental light JSX rendering library meant to be the base for building great abstractions on top of the JavaScript of the future. Vulture is inspired by React, but it attempts to take the core principles of React to their extremes and add some basic asynchronous features on top.

The essence of React is a one input one output function: `(data) => view`. However, this simple concept somehow takes about 150kB to implement and requires a component most of the time instead of just a pure function. The reason for this is that `(data) => view` does not give us a good way to handle component state, so that’s where the React component architecture is useful. But Vulture thinks there’s a better way to handle state in a JSX rendering library.

[Andrew Clark](https://github.com/acdlite) initially explored this area with [`recompose`](https://github.com/acdlite/recompose). A project which allows you to write all your components as stateless functional components. In the [Recompose docs](https://github.com/acdlite/recompose/blob/master/docs/API.md#observable-utilities) the assertion is made that:

> It turns out that much of the React Component API can be expressed in terms of observables:
> 
> - Instead of `setState()`, combine multiple streams together.
> - Instead of `getInitialState()`, use `startWith()` or `concat()`.
> - Instead of `shouldComponentUpdate()`, use `distinctUntilChanged()`, `debounce()`, etc.

Vulture agrees with this assertion. The most ideal model for a React-like library is not `(data) => view` + components (as React has implemented). But rather `(data$) => view$` (`x$` is shorthand for “an observable of `x`”).

* * *

In the rest of this document I’ll talk more about how Vulture implements the `(data$) => view$` pattern with various specific examples from the Vulture codebase.

Please feel free to explore the code! I’m proud of the quality. I’ll try to add links to relevant snippets to help give you a guided toor.

## Promises and Observables as JSX Nodes
Unlike React or other JSX libraries, Vulture was designed with server rendering in mind *first*. Similar to how some designers think mobile first, Vulture is server first. Why? Server rendering is important for a number of reasons. Including, but not limited to: easily readable by search engines, more accessible, content parsing (like a reader such as Pocket might do), better performance on low end devices, and reducing the time to the first meaningful paint of the browser.

React, while it supports server side rendering, does not do a very good job at it. This is because server side rendering is *synchronous*. `ReactDOM.renderToString` is a synchronous method and therefore we must wait for the *entire* app to be ready before we can send down a single byte. A better model would be if we streamed JSX elements as their data dependencies had resolved. This way, we could immeadiately stream the `<head>` to the browser and then a short while after stream down our navbar while we wait for the main content area’s data dependencies to finish fetching.

Vulture was designed to make this streaming model easy (and this had some interesting side effects). In order to make streaming easy, with Vulture you embed asynchronous promises and observables *into the JSX*. So for instance say you had JSX like this using data retrieved from the GitHub API:

```jsx
const jsx =
  <div>
    <section>
      {fetch('https://api.github.com/users/calebmer').then(response => response.json()).then(data =>
        <div>
          <header>
            {data.login}—{data.name}
          </header>
          <p>{data.bio}</p>
        </div>
      )}
    </section>
    <section>
      {fetch('https://api.github.com/users/calebmer/repos').then(…)}
    </section>
  </div>
```

You’d embed the promises directly in the JSX and when the promises resolves, the JSX will be rendered. Now how is this good for streaming? Well because Vulture now knows about the status of your asynchronous operations, it can send down *only the JSX that has finished resolving* while holding the connection open and waiting for the rest of the data to resolve.

This also works for observables:

```jsx
const jsx =
  <div>
    {Observable.of(1, 2, 3, 4, 5, 6).delay(1000).map(n => <strong>{n}</strong>)}
  </div>
```

When the observable completes, the last JSX value in the observable will be streamed to the browser. So the above example would return the following in chunks over time:

```html
<div> <!-- streamed asap -->
  <strong>6</strong> <!-- streamed after the observable has completed -->
</div> <!-- streamed asap after the observable completes -->
```

Note that *only* the last value in the observable was rendered, and not any of the proceeding values.

When used in a browser, the latest value in the observable will be the one that gets rendered. So everytime you call `next` on an observable that has a Vulture subscriber, your page will update. See [this](https://github.com/calebmer/vulture/blob/next/examples/counter-simple/index.html) example for how that works.

Some code snippets for the adventurous:

- [JSX type definitions](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/jsx/jsx.ts)
- [JSX asynchronous type definitions](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/async/jsx.ts)
- [Partial renderer interface for streaming](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/renderer/partial.ts)
- [Partial renderer implementation for HTML strings](https://github.com/calebmer/vulture/blob/next/packages/vulture-string/src/renderer.ts)
- [JSX streaming code](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/async/stream.ts)

## Reducers as Renderers
Vulture was initially designed to provide a great server streaming experience, however in order to be *really* useful we also needed a DOM renderer. Similar to how React has `react-dom`, Vulture has `vulture-dom`. The way JSX diffing and patching is done in Vulture is interesting, light weight, and familiar to Redux developers. So even if it isn’t public API, I still want to talk about it 😊

On the server we are creating new string renderings of a JSX node every time we go to stream. However, in the browser, we need to patch our existing DOM nodes with updates as the observables embedded in the JSX definitions emit new values. At the same time though, we don’t want to be constrained to just using the DOM so we want to build a system which can support multiple renderers some day (maybe a `vulture-native`?).

To do this Vulture uses a [diff algorithm](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/diff/diff.ts) that returns [patches](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/diff/patch.ts), or in Redux terminology “actions.” These patches/actions are then fed into a [reducer renderer](https://github.com/calebmer/vulture/blob/next/packages/vulture/src/diff/patch.ts) which patches the native nodes.

See the [DOM reducer](https://github.com/calebmer/vulture/blob/next/packages/vulture-dom/src/renderer/reducer.ts) which brings all of these ideas together. The only main difference between Redux and this reducer renderer system, is that we don’t require the state (in this case a DOM node) to be immutable.

All diffing/patching are synchronous operations (no promises or observables involved). Vulture takes these operations and makes them asynchronous with higher order functions.

## Status
I’ve currently paused development on Vulture, for a number of reasons. Firstmost is that I’m really not interested in competing in the frontend framework space. Second is that Vulture currently doesn’t solve any needs for me that React already currently solves. And if I really believe `(data$) => view$` is the right abstraction, I can just use [`recompose`](https://github.com/acdlite/recompose) with React. Third is that in order for Vulture to really fill a niche it needs a state management pattern that can be progressively enhanced. Remember, I made Vulture for server rendering and progressive enhancement. In order for Vulture to be useful (for me) I need to find a pattern that fits this usecase well. This will require lots of exploration with HTML5 forms…

However, if *you* think this could solve *your* real problems, let’s collaborate!
