module.exports = (opts = {}) => () => {

    return {
        ...opts,
        destroy: () => null
    }
}