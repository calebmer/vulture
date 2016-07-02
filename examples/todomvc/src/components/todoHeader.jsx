export const render = store =>
  <div>
    {store.todoCount$.map(n =>
      n !== 0
        ? <button onClick={store.toggleAllTodosComplete}/>
        : null
    )}
    <input
      type="text"
      name="new-todo"
      value=""
      autofocus={true}
      placeholder="What needs to be done?"
      onKeyDown={event => {
        switch (event.keyCode) {
          case ESCAPE_KEY:
            event.target.value = ''
            break
          case ENTER_KEY:
            store.newTodo(event.target.value)
            event.target.value = ''
            break
        }
      }}
    />
  </div>
