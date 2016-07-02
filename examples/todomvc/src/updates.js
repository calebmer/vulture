export const toggleTodoComplete = id => state => ({
  ...state,
  todoByID: {
    ...state.todoByID,
    [id]: {
      ...state.todoByID[id],
      completed: !state.todoByID[id].completed,
    },
  },
})

export const updateTodoText = (id, text) => state => ({
  ...state,
  todoByID: {
    ...state.todoByID,
    [id]: {
      ...state.todoByID[id],
      text,
    },
  },
})

export const deleteTodo = id => state => ({
  ...state,
  todoIDs: state.todoIDs.filter(todoID => todoID !== id),
  todoByID: {
    ...state.todoByID,
    [id]: undefined,
  },
})

export const setTodoFilter = todoFilter => state => ({
  ...state,
  todoFilter,
})

export const clearCompleted = () => state => {
  const isCompleted = todo => todo ? todo.completed : true

  const todoIDs = state.todoIDs.filter(id => !isCompleted(state.todoByID[id]))

  const lastTodoByID = state.todoByID
  const todoByID = {}

  for (const id in lasttodoByID)
    if (lastTodoByID.hasOwnProperty(id))
      if (!isCompleted(lasttodoByID[id]))
        todoByID[id] = lasttodoByID[id]

  return {
    ...state,
    todoIDs,
    todoByID,
  }
}

export const toggleAllTodosComplete = () => state => {
  const lastTodoByID = state.todoByID
  const todoByID = {}

  const allCompleted = state.todoByID.map(id => lastTodoByID[id]).all(todo => todo.completed)
  const completed = !allCompleted

  for (const id in state.todoIDs)
    if (lasttodoByID.hasOwnProperty(id))
      todoByID[id] = { ...lasttodoByID[id], completed }

  return {
    ...state,
    todoByID,
  }
}
