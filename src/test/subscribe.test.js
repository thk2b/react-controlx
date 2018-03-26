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
    const TestComponent = ({ controller }) => {
        return <div>
            {controller}
        </div>
    }
    const SubscribedTestComponent = subscribe({ controller })(TestComponent)

    test('should render the decorated component', () => {
        const wrapper = mount(<SubscribedTestComponent />)
        expect(wrapper.find('div').exists()).toBe(true)
        wrapper.unmount()
    })
    it('should pass it the controller\'s state', () => {
        const wrapper = mount(<SubscribedTestComponent />)
        expect(wrapper.find(TestComponent).props().controller).toEqual(initialState)
    })
    it('should update the component when the controller updates', () => {
        const wrapper = mount(<SubscribedTestComponent />)
        const newState = 'new value'
        controller.set(newState)
        wrapper.update()
        expect(wrapper.find(TestComponent).props().controller).toEqual(newState) 
    })
})