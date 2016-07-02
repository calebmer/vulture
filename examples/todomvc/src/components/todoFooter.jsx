export const render = store =>
  <div>
    <p>
      {store.incompleteTodosCount$} item{store.incompleteTodosCount$.map(n => n === 1 ? '' : 's')} left
    </p>
    <nav>
      <ul>
        <li><a onClick={() => store.setTodoFilter('all')}>All</a></li>
        <li><a onClick={() => store.setTodoFilter('active')}>Active</a></li>
        <li><a onClick={() => store.setTodoFilter('completed')}>Completed</a></li>
      </ul>
    </nav>
    {store.completedTodosCount$.map(n =>
      n > 0
        ? <button onClick={store.clearCompleted}>
          Clear completed
        </button>
        : null
    )}
  </div>
