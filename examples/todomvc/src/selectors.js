const todoIDs$ = state$ =>
  state$.map(state => state.todoIDs).distinctUntilChanged()

const todos$ = state$ =>
  state$.map(state => state.todoIDs.map(id => state.todoByID[id])).distinctUntilChanged(shallowArrayCompare)

const todosWithIDs$ = state$ =>
  Observable.combineLatest(
    todoIDs$(state$),
    todos$(state$),
    (ids, todos) => ids.map((id, i) => ({
      id,
      todo: todos[i],
    }
  )))

const todoFilter$ = state$ =>
  state$.map(state => state.todoFilter).distinctUntilChanged()

const todoFilterFunction$ = state$ =>
  todoFilter$(state$).map(filter => {
    switch (filter) {
      case 'all': return () => true
      case 'active': return todo => !todo.completed
      case 'completed': return todo => todo.completed
      default: throw new Error(`Filter '${filter}' not supported.`)
    }
  })

export const filteredTodoIDs$ = state$ =>
  Observable.combineLatest(
    todosWithIDs$(state$),
    todoFilterFunction$(state$),
    (todosWithIDs, todoFilterFunction) =>
      todosWithIDs.filter(({ todo }) => todoFilterFunction(todo)).map(({ id }) => id)
  )

export const todoCount$ = state$ =>
  state$.map(state => state.todoIDs.length).distinctUntilChanged()

export const completedTodosCount$ = state$ =>
  todos$(state$).map(todos => todos.filter(todo => todo.completed).length)

export const incompleteTodosCount$ = state$ =>
  todos$(state$).map(todos => todos.filter(todo => !todo.completed).length)

const getTodo$ = state$ => memoize(id =>
  state$.map(state => state.todoByID[id]).distinctUntilChanged()
)

export const getTodoText$ = state$ => memoize(id =>
  getTodo$(id).map(todo => todo.text).distinctUntilChanged()
)

function shallowArrayCompare (a, b) {
  if (a.length !== b.length)
    return false

  for (const i = 0; i < a.length; i++)
    if (a[i] !== b[i])
      return false

  return true
}
