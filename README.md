`npm install --save react-xcontrol`

# react-xcontrol
Subscribe a react component to a controlx controller

The central idea is that the view (in this case, React Components) is computed based on the state. The view depends on the state and should update whenever the state changes.

# Exports
```js
import ComputedComponent, { Connect } from 'react-xcontrol'
```

# API

- `ComputedComponent ( Component ) ( controllers, mapState )`
Returns a class, extending the provided Component, that renders the wrapped component with the result of mapState on the combined state of the controllers. When any of their stores updates, the component also updates with the new mapped state.
Uses the `xcontrol` `Computed` class. Refer to its documentation for more information on parameters.

- `Connect( Component )`
Returns a `xcontrol.Controller` that updates the component's props whenever the store updates.

- `Computed( Connect ( Component ))( controllers, mapState )`
The implementation of `ComputedComponent`.

## Usage
### Passing stores to components
```js
import ComputedComponent from 'react-xcontrol'
import myController from '../controllers/myController'
import MyComponent from '../components/MyComponent'


export default ComputedComponent ( MyComponent )({ myController }) 
```

Here, the exported component will recieve a 'myController' prop equal to the controller's state. Whenever the controller's store updates, the component will also re-render.

```js
const mapStateToProps = ({ myController }) => ({ data: myController.relevantData })

export default ComputedComponent ( MyComponent )({ myController }, mapStateToProps)
```
In this case, the exported component will recieve a `myComponent` prop.

### Causing actions from components
```js
import React from 'react'
import myController from '../controllers/myController'

export default props => <button
  onClick={e => myController.someAction()}
>
  submit
</button>
```
Actions can simply be embeded into components, without being passed as props. Just call a controller's methods directly from the component.
