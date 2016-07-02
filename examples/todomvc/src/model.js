import * as selectors from './selectors'
import * as updates from './updates'

const initialState = {
  todoIDs: [],
  todoByID: {},
  todoFilter: 'all',
}

// function createStore () {
//   const update$ = new Subject()
//   const state$ = update$.scan((state, update) => update(state), initialState).cache(1)
//
//   return {
//     update$,
//     state$,
//     ...createSelectors(state$),
//     ...bindUpdates(update$)(createUpdates()),
//   }
// }

const store = createStore(
  initialState,
  selectors,
  updates
)

// TODO: URL stuffs…
// store.todoFilter$.subscribe()
