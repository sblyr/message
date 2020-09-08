const fs = require('fs')

module.exports = async (path) => new Promise((resolve, reject) => {

    fs.readFile(path, (err, data) => {

        if (err) {
            return reject(err)
        }

        resolve(data)
    })
})