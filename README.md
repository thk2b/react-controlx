# react-controlx
Subscribe a react component to a controlx controller

# Usage
```js
subscribe(
  controllerInstance,
  mapStateToProps,
  mapActionsToProps
)
```

```js 
// todos/index.js
import subscribe from 'react-controlx'
import { todos, Todos } from '../'
import { todosFilter } from '../../filter'

mapControllersToProps(){
  todos: todos.getWhere(
    todo => todosFilter.ok(todo)
  )
}

export default subscribe(filter)(
  subscribe(
    todos,
    mapControllersToProps
  )(TodoList)
)
// recieves todos: [ { id: 123, text: 'this', done: false }, ... ]

export default subscribe(filter, todos)(TodoList) 
// TodoList filters according to the filter, not anyhing in between
// recieves all filter actions, methods and state as props: { filter: { state: 'DONE', ok: todo => Boolean, set: String }}
```
