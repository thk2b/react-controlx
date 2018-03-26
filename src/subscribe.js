import React from 'react'

export default controllers => Component => {
    return class extends React.Component {
        constructor(props){
            super(props)
            this.state = {}
            this.unsubscribe = {}
        }
        componentDidMount = () => {
            Object.entries(controllers).forEach(
                ([name, controller]) => {
                    const unsubscribe = controller.subscribe(
                        state => this.setState({ [name]: state })
                    )
                    this.unsubscribe[name] = unsubscribe
                }
            )
        }
        componentWillUnmount = () => {
            Object.values(this.unsubscribe).forEach(
                unsubscribe => unsubscribe()
            )
        }
        render(){
            return <Component
                {...this.state}
                {...this.props}
            >
                {this.children}
            </Component>
        }
    }
}