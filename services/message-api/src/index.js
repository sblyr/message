const cors = require('cors')
const os = require('os')
const express = require('express')
const pkg = require('../package.json')
const buildInfo = require('../build-info.json')
const passport = require('@sublayer/passport-sdk')
const auth = require('@sublayer/passport-sdk/middleware')
const sdk = require('./sdk')
const api = require('./api')

const app = express()

const acl = (req, res, next) => {

    if (!req.session || req.session.roles.includes('mollie-moneybird.read') === false) {
        res.send({
            status: 'error',
            message: 'unauthorized'
        })
        return
    }

    next()
}

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)

app.use('/v0',
    passport({
        roles: ['mollie-moneybird.auth']
    })
)

app.use('/v0',
    api()
)

app.use('/v0', auth, acl,
    sdk()
)

app.get('/', (req, res) => {

    res.json({
        name: pkg.name,
        platform: {
            type: os.type(),
            release: os.release()
        },
        hostname: os.hostname(),
        build: buildInfo
    })
})

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'

app.listen(PORT, HOST, () => {
    console.log(`${pkg.name} listening on ${HOST}:${PORT}`)
})