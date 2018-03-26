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
import List from 'oui/List'
import { todosFilter } from '../../filter'

mapControllers = ({ filter, todos }) => ({
  items: Object.values(...todos.getWhere(
    todo => todosFilter.ok(todo)
  ))
})

export default subscribe({ filter, todos },
    mapControllers
)(List)
// recieves todos: [ { id: 123, text: 'this', done: false }, ... ]

export default subscribe(filter, todos)(TodoList) 
// TodoList filters according to the filter, not anyhing in between
// recieves all filter actions, methods and state as props: { filter: { state: 'DONE', ok: todo => Boolean, set: String }}
```
