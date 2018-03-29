import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import React from 'react'
import Value from 'xcontrol/lib/models/Value'
import { computed, reactive } from 'xcontrol'

import connect from '../connect'

Enzyme.configure({ adapter: new Adapter() })

class ReactiveValue extends reactive(Value){}

const components = {
    'class component': class extends React.Component {
        render(){
            return <div />
        }
    }, 
    'stateless functional component': ({}) => <div />
}

const runTestSuite = ([componentType, TestComponent]) => {
    describe(`connect HOC with ${componentType}`, () => {
        describe('creating a Component Controller', () => {
            class ConnectedTestComponent extends connect(TestComponent){}

            it('should have extended the Component subclass', () => {
                const c = new ConnectedTestComponent()
                expect(c instanceof React.Component).toBe(true)
            })
        })
        describe('rendering a the decorated Component', () => {
            const initialState = 'initial state'
            const nextState = 'next state'
            const value = new ReactiveValue(initialState)
            class ComputedTestComponent extends computed(
                connect(TestComponent)
            )({ value }){}

            const wrapper = mount(<ComputedTestComponent testProp>
                <span/>
                <span/>
            </ComputedTestComponent>)

            it('should render the decorated component', () => {
                expect(wrapper.find('div').exists()).toBe(true)
            })
            it('should pass props down to the decorated component', () => {
                expect(wrapper.find(TestComponent).props().testProp).toBe(true)
            })
            it('should pass children down to the decorated component', () => {
                expect(wrapper.find(TestComponent).props().children.length).toBe(2)
            })
            it('should unsubscribe when dismounting', () => {
                expect(Object.keys(value._subscribers).length).toBe(1)
                wrapper.unmount()
                expect(Object.keys(value._subscribers).length).toBe(0)
            })
        })
        describe('recieving state from controllers', () => {
            const initialState0 = 'test value 0'
            const initialState1 = 'test value 1'

            describe('with default mapStateToProps', () => {
                const c0 = new ReactiveValue(initialState0)
                const c1 = new ReactiveValue(initialState1)
                const ComputedTestComponent = computed(connect(TestComponent))({ c0, c1 })
                const wrapper = mount(<ComputedTestComponent />)
                
                afterAll(() => wrapper.unmount())
                it('should provide the controlers\'s store', () => {
                    expect(
                        wrapper.find(TestComponent).props()
                    ).toEqual({
                        c0: initialState0,
                        c1: initialState1,
                    })
                })
            })
            describe('with custom mapStateToProps', () => {            
                describe('mapStateToProps arguments', () => {
                    const c0 = new ReactiveValue(initialState0)
                    const c1 = new ReactiveValue(initialState1)
                    const otherProp = 'other'
                    
                    it('shoud pass the correct arguments when mouting', () => {
                        const ComputedTestComponent = computed(connect(TestComponent))(
                            { c0, c1 }, (state, ownProps) => {
                                expect(state).toEqual({
                                    c0: initialState0,
                                    c1: initialState1,
                                })
                                expect(ownProps).toEqual({
                                    otherProp
                                })
                                return state
                            }
                        )
                        shallow(<ComputedTestComponent otherProp={otherProp}/>).unmount()
                    })
                    it('should pass the correct arguments when the controller\'s store changes', () => {
                        const mapStateToProps = ({ c0, c1 }, { otherProp }) => ({ c0, c1, otherProp })
                        const mstpSpy = sinon.spy(mapStateToProps)

                        const ComputedTestComponent = computed(connect(TestComponent))(
                            { c0, c1 }, mstpSpy
                        )
                        const wrapper = shallow(<ComputedTestComponent otherProp={otherProp}/>)
                        
                        const newState0 = 'new state 0'
                        c0.set(newState0)

                        expect(mstpSpy.calledWith({ c0: newState0, c1: initialState1 }))
                        expect(mstpSpy.callCount).toBe(2)
                        wrapper.unmount()
                    })
                })
                describe('passing props to the decorated component', () => {
                    const c0 = new ReactiveValue(initialState0)
                    const c1 = new ReactiveValue(initialState1)
                    const otherProp = 'other prop'

                    const mapStateToProps = ({ c0, c1 }, { otherProp }) => ({
                        combined: c0 + c1 + otherProp
                    })
                    const ComputedTestComponent = computed(connect(TestComponent))(
                        { c0, c1 }, mapStateToProps
                    )
                    const wrapper = mount(<ComputedTestComponent otherProp={otherProp}/>)

                    it('should pass the right props', () => {
                        const expected = initialState0 + initialState1 + otherProp
                        expect(
                            wrapper.find(TestComponent).props().combined
                        ).toEqual(expected)
                    })
                    it('should pass the right props when the controller\'s store changes', () => {
                        const newState = 'new state 0'
                        const expected = newState + initialState1 + otherProp
                        c0.set(newState)
                        expect(
                            wrapper.update().find(TestComponent).props().combined
                        ).toEqual(expected)
                    })
                })
            })
        })
    })
}

Object.entries(components).forEach(runTestSuite)