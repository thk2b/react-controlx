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
            const combine = (a, b) => a + ' ' + b
            
            describe('mapStateToProps arguments', () => {
                const c0 = new TestController(initialState0)
                const c1 = new TestController(initialState1)

                it('shoud pass the correct arguments when mouting', () => {
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
                        }
                    )(TestComponent)
                    shallow(<SubscribedTestComponent otherProp={otherProp}/>).unmount()
                })
                it('should pass the correct arguments when the controller\'s state changes', () => {
                    const mapStateToProps = ({ c0, c1 }) => ({ c0, c1 })
                    const mstpSpy = sinon.spy(mapStateToProps)

                    const SubscribedTestComponent = subscribe({ c0, c1 })(
                        mstpSpy
                    )(TestComponent)
                    const wrapper = shallow(<SubscribedTestComponent />)
                    
                    const newState0 = 'new state 0'
                    c0.set(newState0)

                    expect(mstpSpy.calledWith({ c0: newState0, c1: initialState1 }))
                    expect(mstpSpy.callCount).toBe(2)
                    wrapper.unmount()
                })
            })
            describe('passing props to the decorated component', () => {
                const c0 = new TestController(initialState0)
                const c1 = new TestController(initialState1)

                const mapStateToProps = ({ c0, c1 }) => ({
                    combined: combine(c0, c1)
                })
                const SubscribedTestComponent = subscribe({ c0, c1 })(mapStateToProps)(TestComponent)
                const wrapper = mount(<SubscribedTestComponent />)

                it('should pass the right props', () => {
                    expect(
                        wrapper.find(TestComponent).props().combined
                    ).toEqual(combine(initialState0, initialState1))
                })
                it('should pass the right props when the controller\'s state changes', () => {
                    const newState0 = 'new state 0'
                    c0.set(newState0)
                    expect(
                        wrapper.update().find(TestComponent).props().combined
                    ).toEqual(combine(newState0, initialState1))
                })
            })
        })
    })
    describe('passing actions to controllers', () => {
        const initialState = 'initial state'
        const controller = new TestController(initialState)

        describe('mapActionsToProps arguments', () => {
            const someProp = 'some prop'
            const mapActionsToProps = ownProps => {
                expect(ownProps).toEqual({ someProp })
                return {}
            }
            const SubscribedTestComponent = subscribe({ controller })(undefined, mapActionsToProps)(TestComponent)
            shallow(<SubscribedTestComponent someProp={someProp} />).unmount()
        })
        describe('passing actions as component props', () => {
            const newState = 'new state'
            const Component = ({ controller, set }) => (
                <div onClick={e => {
                    set(newState)
                }}>hi</div>
            )
            const mapStateToProps = ({ controller }) => ({ value: controller })
            const mapActionsToProps = () => {
                return { set: controller.set.bind(controller) }
            }
            const SubscribedTestComponent = subscribe({ controller })
                (mapStateToProps, mapActionsToProps)
            (Component)
            const wrapper = mount(<SubscribedTestComponent />)

            const component = wrapper.find(Component)
            afterAll(() =>  wrapper.unmount())
            it('should pass the result of mapActionsToProps as props', () => {
                expect(typeof component.props().set).toEqual('function')
            })    
            it('calling the action should cause the controller and component to update', () => {
                const spy = sinon.spy()
                controller.subscribe(spy)

                component.find('div').first().simulate('click')
                expect(spy.calledWith(newState))
                expect(
                    wrapper.find(Component).props().value
                ).toBe(newState)
            })
        })
    })
})