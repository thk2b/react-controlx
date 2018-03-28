export default (condition, message) => {
    if(! condition) console.warn('Warning: ', message)
}