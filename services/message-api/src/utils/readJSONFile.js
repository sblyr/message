const readFile = require('./readFile')
const parseJSON = require('./parseJSON')

module.exports = async (path) => {

    const encoded = await readFile(path)

    return parseJSON(encoded)
}