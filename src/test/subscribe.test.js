import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

// import TestController from './TestController'
import { Controller } from 'controlx'
import subscribe from '../subscribe'

Enzyme.configure({ adapter: new Adapter() })

class TestController extends Controller {
    set(value){
        this.state = value
    }
}
const TestComponent = ({ controller, children }) => {
    return <div>
       {controller.state}
    </div>
}

describe('subscribe hoc', () => {
    describe('rendering the decorated component', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })(TestComponent)

        const wrapper = mount(
            <SubscribedTestComponent testProp={1}>
                <span>child1</span>
                <span>child2</span>
            </SubscribedTestComponent>
        )

        it('should render the decorated component', () => {
            expect(wrapper.find('div').exists()).toBe(true)
        })
        it('should pass props down to the decorated component', () => {
            expect(wrapper.find(TestComponent).props().testProp).toBe(1)
        })
        it('should pass children down to the decorated component', () => {
            expect(wrapper.find(TestComponent).props().children.length).toBe(2)
        })
        it('should unsubscribe when dismounting', () => {
            expect(Object.keys(controller._subscribers).length).toBe(1)
            wrapper.unmount()
            expect(Object.keys(controller._subscribers).length).toBe(0)
        })
    })
    describe('recieving the controller\'s state as props', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })(TestComponent)
        const wrapper = mount(<SubscribedTestComponent />)

        afterAll(() => wrapper.unmount())
        it('should include the state on the controller\'s prop', () => {
            expect(wrapper.find(TestComponent).props().controller.state).toEqual(initialState)
        })
    })
    describe('updating the controller\'s state', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })(TestComponent)
        const wrapper = mount(<SubscribedTestComponent />)

        afterAll(() => wrapper.unmount())
        it('should update the component', () => {
            const newState = 'new value'
            controller.set(newState)
            wrapper.update()
            expect(wrapper.find(TestComponent).props().controller.state).toEqual(newState) 
        })
    })
    describe('causing actions from the decorated component', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })(TestComponent)
        const wrapper = mount(<SubscribedTestComponent />)

        afterAll(() => wrapper.unmount())
        it('should update the controller and notify subscribers', () => {
            const callback = sinon.spy()
            controller.subscribe(callback)
            const newState = 'new state'
            wrapper.find(TestComponent).props().controller.set(newState)
            expect(callback.calledOnceWith(newState))
        })
    })
})