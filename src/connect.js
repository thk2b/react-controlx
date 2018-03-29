import React from 'react'
import { Controller } from 'xcontrol'

import invariant from './lib/invariant'

/** A HOC that takes a React.Component and returns a controller.
 * It has the side effect of updating the component whenever its store is updated.
 * It must be wrapped into a call to `computed` or `withActions`
 */

export default Component => class ComponentController extends Controller( React.Component ) {
    constructor(props){
        super(props)
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

        return <Component
            {...props }    
            {...state }
        >
            { children }
        </Component>
    }
}