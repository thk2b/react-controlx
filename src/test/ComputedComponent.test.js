import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

import React from 'react'
import { Model } from 'xcontrol'

import ComputedComponent from '../ComputedComponent'

Enzyme.configure({ adapter: new Adapter() })

describe('ComputedTestComponent', () => {
    class CounterModel extends Model {
        increment(by = 1){
            this.store = this.store + by
        }
        isGreaterThan(n){
            return this.store > n
        }
    }
    const counter = new CounterModel(0)
    
    const CounterComponent = ({ count }) => <div
        onClick={e => counter.increment()}
    > { count } </div>

    it('should map the state and be reactive', () => {
        const ComputedCounterComponent = ComputedComponent ( CounterComponent )(
            { counter }, ({ counter }) => ({ count: counter })
        )
        const wrapper = mount(<ComputedCounterComponent hi/>)
        wrapper.find('div').simulate('click')
        expect(wrapper.find(CounterComponent).props().count).toBe(1)
    })

})