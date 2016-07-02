# Vulture Diff Algorithm
This module contains the code for vulture’s JSX diffing.

Instead of rerendering the app for every new JSX object, vulture rerenders the minimal amount of changes. Therefore vulture needs a diffing algorithm to determine what in the JSX objects has changed.

The diffing model used by vulture is inspired by Redux. Vulture uses tagged action objects to define patches to the rendered tree and a renderer reduces its tree with the actions (although not always in an immutable way 😉).

## Exports
- `diff`
- `Patch`
- `Path`
- `PathKey`
- `getPathKey`
