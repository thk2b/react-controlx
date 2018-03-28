import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import React from 'react'
import Value from 'xcontrol/lib/models/Value'
import { computed, reactive } from 'xcontrol'

import connect from '../connect'

Enzyme.configure({ adapter: new Adapter() })

// const TestComponent = ({}) => <div />
class TestComponent extends React.Component {
    render(){
        return <div />
    }
}

class ReactiveValue extends reactive(Value){}

describe('connect HOC', () => {
    const initialState = 'initial state'
    // describe.skip('creating a Component Controller', () => {
    //     const value = new ReactiveValue(initialState)
    //     class ConnectedTestComponent extends connect(TestComponent){}
    //     const c = new ConnectedTestComponent()

    //     it('should throw an invariant because no store is ', () => {
    //         expect(new ConnectedTestComponent()).toThrow()
    //     })
    //     it('should have extended the subclass', () => {
    //         expect(typeof c.render).toEqual('function')
    //     })
    // })
    describe('rendering a Component Controller', () => {
        const value = new ReactiveValue(initialState)
        const nextState = 'next state'
        class ConnectedTestComponent extends computed({ value })(

        )(connect(TestComponent)){}
        const wrapper = mount(<ConnectedTestComponent />)

        it('should have the initialState', () => {
            expect(wrapper.find(TestComponent).props().value).toEqual(initialState)
        })
        it('should update props', () => {
            value.set(nextState)
            expect(wrapper.update().find(TestComponent).props().value).toEqual(nextState)
        })
        it('should be passed the result of mapState as props', () => {

        })
    })
    describe('updating a Component Controller', () => {
        const value = new ReactiveValue(initialState)
        class ConnectedTestComponent extends computed({ value })(
            
        )(connect(TestComponent)){}

        it('should have the initialState', () => {
            const wrapper = mount(<ConnectedTestComponent hi/>)
            expect(wrapper.update().find(TestComponent).props().value).toEqual(initialState)
        })
    })
})