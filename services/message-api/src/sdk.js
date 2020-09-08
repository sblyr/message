const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const createConnection = require('./database/createConnection')
const createSchema = require("./sdk/schema/createSchema")({
    configPath: path.join(__dirname, 'schema.yaml')
})

const schema = createSchema()()

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
        schema,
        destroy: async () => {
            await db.destroy()
        }
    }
}

const handle = require('./sdk/http/handle')({ createContext })

const getRecords = require('./sdk/model/getRecords')
const getRecord = require('./sdk/model/getRecord')
const getComponent = require('./sdk/model/getComponent')

module.exports = () => {

    const app = express()

    app.get("/schema", handle(ctx => () => ctx.schema))

    app.get("/records/:modelId", handle(getRecords));

    app.get("/record/:modelId/:recordId", handle(getRecord));

    app.post("/component/has-many", bodyParser.json(), handle(getComponent));

    return app
}