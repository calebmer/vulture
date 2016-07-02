export const render = store => memoize(todoID => {
  const editing$ = new Subject()
  return (
    <div>
      {Observable.combineLatest(
        store.getTodoText$(todoID),
        editing$.startWith(false),
        (text, editing) =>
          editing
            ? renderInput(text, newText => {
              if (newText) store.updateTodoText(todoID, newText)
              editing$.next(false)
            })
            : <p onDblClick={() => editing$.next(true)}>
              {text}
            </p>
      )}
      <button onClick={() => store.toggleTodoCompleted(todoID)}/>
      <button onClick={() => store.deleteTodo(todoID)}/>
    </div>
  )
})

const renderInput = (initialText, finish) =>
  <input
    type="text"
    name="edit-todo"
    value={initialText}
    onKeyDown={event => {
      switch (event.keyCode) {
        case ESCAPE_KEY:
          finish()
          break
        case ENTER_KEY:
          finish(event.target.value)
          break
      }
    }}
  />
