const bodyParser = require('body-parser')
const express = require('express')
const send = require('./handlers/send')

const createConnection = require('../database/createConnection')

const createContext = async () => {

    const db = createConnection({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    })

    return {
        db,
        destroy: async () => {
            await db.destroy()
        }
    }
}

const handle = require('../sdk/http/handle')({ createContext })

module.exports = () => {

    const app = express()

    app.post('/send', bodyParser.json(), handle(send))

    return app
}