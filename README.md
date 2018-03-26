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

const mapStateToProps = () => ({
  items: Object.values(...todos.getWhere(
    todo => todosFilter.ok(todo)
  ))
})

const mapActionsToProps = () => ({
  setFilter: filter.set.bind(filter)
})

export default subscribe({ filter, todos })(
    mapStateToProps, mapActionsToProps
)(List)
// recieves todos: [ { id: 123, text: 'this', done: false }, ... ]
```
