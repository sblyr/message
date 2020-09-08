const fs = require('fs')

module.exports = async (path, data) => new Promise((resolve, reject) => {

    fs.writeFile(path, data, (err, data) => {

        if (err) {
            return reject(err)
        }

        resolve(data)
    })
})