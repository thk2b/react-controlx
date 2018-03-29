# react-xcontrol
Subscribe a react component to a controlx controller

# API
- `Reactive(Super)`

Overrides the Super's store get/set to notify all subscribers.

- `Subscribe(Super)(controllers, mapState, mapActions)`

Subscribes the Super's store to the result of calling mapState with the combined state of all controllers. This value is recomputed whenever any controller's store update.

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

const mapStateToProps = ({ todos }) => ({
  items: Object.values(...where(todos,
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
