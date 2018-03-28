import createModel from 'xcontrol/lib/models/createModel'
import React from 'react'

import invariant from './lib/invariant'

/** A HOC that takes a React.Component and returns a controller.
 * It has the side effect of updating the component whenever its store is updated.
 * It must be wrapped into a call to `computed` or `withActions`
 */

export default Component => class ComponentController extends createModel(React.Component){
    constructor(selectedProps){
        super(selectedProps)
        // invariant(this.store,
        //     `In connect(${Component.name}):\n` +
        //     `A ComponentController was found without a store.\n` +
        //     `A connected React.Component must be wrapped in a \`computed\` call,\n` +
        //     `otherwise the component will not be reactive.`
        // )
    }
    componentWillMount = () => {
        this._isMounted = true
        this.setState(this.store)
    }
    
    componentWillUnmount(){
        this.unsubscribe()
    }
    get store(){
        return super.store
    }
    set store(nextState){
        if(this._isMounted) this.setState(nextState)
        super.store = nextState
    }
    render(){
        const { children, ...props } = this.props
        const { state } = this 
        // console.log(state)
        return <Component
            {...props }    
            {...state }
        >
            { children }
        </Component>
    }
}

// Usage:
// export default computed(connect(List),
//     ({ controller }) => ({ items: controller })
// )({ controller })