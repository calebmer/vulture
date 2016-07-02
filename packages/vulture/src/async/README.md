# Vulture Async
A big selling point of Vulture is that it allows for asynchronous JSX at a primitive level. This allows for some pretty awesome things.

Basically this module takes all of the synchronous interfaces from the other modules and composes them into powerful asynchronous interfaces.

Most renderer libraries will also want to use some exported utilities like the `createRender` function to create a general purpose render functions.

## Exports
- `JSXAsync`
- `JSXNodeAsync`
- `JSXElementAsync`
- `ChildrenAsync`
- `diffAsync`
- `createRender`
- `createRenderStream`
