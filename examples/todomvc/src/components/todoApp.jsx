import * as todoHeader from './todoHeader'
import * as todoItem from './todoItem'
import * as todoFooter from './todoFooter'

export const render = store =>
  <main>
    <div>
      <header>
        {todoHeader.render(store)}
      </header>
      <section>
        <ul>
          {store.filteredTodoIDs$.map(todoIDs => todoIDs.map(id =>
            <li id={`todo-${id}`}>
              {todoItem.render(store)(id)}
            </li>
          ))}
        </ul>
      </section>
      <footer>
        {todoFooter.render(store)}
      </footer>
    </div>
  </main>
