import React from 'react'

const getDisplayName = Component => {
    Component.displayName || Component.name ||'Anonymous'
}

const defaultMapStateToProps = state => state
const defaultMapActionsToProps = props => ({})

export default controllers => (
    mapStateToProps=defaultMapStateToProps,
    mapActionsToProps=defaultMapActionsToProps
) => Component => {
    class SubscribedComponent extends React.Component {
        constructor(props){
            super(props)
            this.state = {}
            this.unsubscribe = {}
        }
        componentWillMount = () => {
            Object.entries(controllers).forEach(
                ([name, controller]) => {
                    const unsubscribe = controller.subscribe(
                        state => this.setState({ [name]: state })
                    ).bind(controller)
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
            const { children, ...rest} = this.props
            const props = {
                ...rest,
                ...mapActionsToProps(this.props),
                ...mapStateToProps(this.state, this.props)
            }
            return <Component {...props}>
                {children}
            </Component>
        }
    }
    SubscribedComponent.displayName = `subscribe(${getDisplayName(Component)})`
    return SubscribedComponent
}