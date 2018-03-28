export default (condition, message) => {
    if(! condition) throw new Error('Invariant Violation: ' + message)
}