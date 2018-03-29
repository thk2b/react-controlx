# react-xcontrol
Subscribe a react component to a controlx controller

# API

- `Connect( Component )`
Returns a `xcontrol.Controller` that updates the component whenever the store updates.

- `Computed( Component )( controllers, mapState )`
Returns a `React.Component` that renders the wrapped component with the result of mapState on the combined state of the controllers. When any of their stores updates, the component also updates with the new mapped state.

- `ComputedComponent ( Component ) ( controllers, mapState )`
Shortcut for the above
