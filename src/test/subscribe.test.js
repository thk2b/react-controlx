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
const TestComponent = () => {
    return <div> hi </div>
}

describe('subscribe hoc', () => {
    describe('rendering the decorated component', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })()(TestComponent)

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
    describe('recieving state from a single controller', () => {
        describe('with default mapStateToProps', () => {
            const initialState = 'test value'
            const controller = new TestController(initialState)
            const SubscribedTestComponent = subscribe({ controller })()(TestComponent)
            const wrapper = mount(<SubscribedTestComponent />)
    
            afterAll(() => wrapper.unmount())
            it('should pass the controller\'s state in props, with the correct name', () => {
                expect(wrapper.find(TestComponent).props().controller).toEqual(initialState)
            })
        })
        describe('with custom mapStateToProps', () => {
            const initialState = 'test value'
            const controller = new TestController(initialState)
            const SubscribedTestComponent = subscribe({ controller })(
                ({ controller }) => ({ myCustomKey: controller })
            )(TestComponent)
            const wrapper = mount(<SubscribedTestComponent />)
    
            afterAll(() => wrapper.unmount())
            it('should pass the controller\'s state in props, with the correct name', () => {
                expect(wrapper.find(TestComponent).props().myCustomKey).toEqual(initialState)
            })
        })
        describe('updating the controller\'s state', () => {
            // TODO: move me to next describe
            const initialState = 'test value'
            const controller = new TestController(initialState)
            const SubscribedTestComponent = subscribe({ controller })()(TestComponent)
            const wrapper = mount(<SubscribedTestComponent />)
    
            afterAll(() => wrapper.unmount())
            it('should update the component', () => {
                const newState = 'new value'
                controller.set(newState)
                wrapper.update()
                expect(wrapper.find(TestComponent).props().controller).toEqual(newState) 
            })
        })
    })
    describe('recieving state from controllers', () => {        
        const initialState0 = 'test value 0'
        const initialState1 = 'test value 1'

        describe('with default mapStateToProps', () => {
            const c0 = new TestController(initialState0)
            const c1 = new TestController(initialState1)
            const SubscribedTestComponent = subscribe({ c0, c1 })()(TestComponent)
            const wrapper = mount(<SubscribedTestComponent />)
            
            afterAll(() => wrapper.unmount())
            it('should provide the controlers\'s state', () => {
                expect(
                    wrapper.find(TestComponent).props()
                ).toEqual({
                    c0: initialState0,
                    c1: initialState1,
                })
            })
        })
        describe('with custom mapStateToProps', () => {
            const c0 = new TestController(initialState0)
            const c1 = new TestController(initialState1)
            const combine = (a, b) => a + ' ' + b
            
            it('shoud give the correct arguments to mapStateToProps', done => {
                const otherProp = 'inventing a string shoundnt be this hard'
                const SubscribedTestComponent = subscribe({ c0, c1 })(
                    (state, ownProps) => {
                        expect(state).toEqual({
                            c0: initialState0,
                            c1: initialState1,
                        })
                        expect(ownProps).toEqual({
                            otherProp
                        })
                        done()
                    }
                )(TestComponent)
                shallow(<SubscribedTestComponent otherProp={otherProp}/>).unmount()
            })
            it('should pass the right props', () => {
                const mapStateToProps = ({ c0, c1 }) => ({
                    combined: combine(c0, c1)
                })
                const SubscribedTestComponent = subscribe({ c0, c1 })(mapStateToProps)(TestComponent)
                const wrapper = mount(<SubscribedTestComponent />)
                expect(
                    wrapper.find(TestComponent).props()
                ).toEqual({
                    combined: combine(initialState0, initialState1)
                })
            })
        })
    })
    describe('updating a controller\'s state', () => {
        
    })
    describe.skip('causing actions from the decorated component', () => {
        const initialState = 'test value'
        const controller = new TestController(initialState)
        const SubscribedTestComponent = subscribe({ controller })()(TestComponent)
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