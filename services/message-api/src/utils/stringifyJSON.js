module.exports = (a, b, c) => {
    try {
        return JSON.stringify(a, b, c)
    } catch (e) {
        console.log('Error stringifying JSON', e)
        return null
    }
}