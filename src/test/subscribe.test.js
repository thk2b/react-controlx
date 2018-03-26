import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// import TestController from './TestController'
import { Controller } from 'controlx'
import subscribe from '../subscribe'

Enzyme.configure({ adapter: new Adapter() })

describe('subscribe hoc', () => {
    class TestController extends Controller {
        set(value){
            this.state = value
        }
    }
    const initialState = 'test value'
    const controller = new TestController(initialState)
    const TestComponent = ({ controller, children }) => {
        return <div>
           {controller.state}
        </div>
    }
    const SubscribedTestComponent = subscribe({ controller })(TestComponent)

    describe('rendering the decorated component', () => {
        const child = ''
        const wrapper = mount(
            <SubscribedTestComponent testProp={1}>
                <span>child1</span>
                <span>child2</span>
            </SubscribedTestComponent>
        )
        afterAll(() => wrapper.unmount())
        it('should render the decorated component', () => {
            expect(wrapper.find('div').exists()).toBe(true)
        })
        it('should pass props down to the decorated component', () => {
            expect(wrapper.find(TestComponent).props().testProp).toBe(1)
        })
        it('should pass children down to the decorated component', () => {
            expect(wrapper.find(TestComponent).props().children.length).toBe(2)
        })
        
    })
    describe('recieving the controller\'s state as props', () => {
        const wrapper = mount(<SubscribedTestComponent />)
        it('should include the state on the controller\'s prop', () => {
            expect(wrapper.find(TestComponent).props().controller.state).toEqual(initialState)
        })
    })
    describe('updating the controller\'s state', () => {
        const wrapper = mount(<SubscribedTestComponent />)
        it('should update the component', () => {
            const newState = 'new value'
            controller.set(newState)
            wrapper.update()
            expect(wrapper.find(TestComponent).props().controller.state).toEqual(newState) 
        })
    })
})