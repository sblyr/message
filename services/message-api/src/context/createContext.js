const createConnection = require('../database/createConnection')

module.exports = async () => {

    const ctx = {}

    ctx.connection = await createConnection()

    ctx.destroy = async () => {

        ctx.connection.end()
    }

    return ctx
}