const axios = require('axios')

module.exports = (ctx) => {

    const mailjet = axios.create({
        baseURL: ctx.channel.config.MAILJET_API_URL + '/send',
        auth: {
            username: ctx.channel.config.MAILJET_API_USERNAME,
            password: ctx.channel.config.MAILJET_API_PASSWORD
        }
    })

    return {
        send: async ({ id, from, to, bcc, cc, subject, body, attachments }) => {

            const Attachments = await Promise.all(
                attachments.map(async attachment => {

                    const { type } = attachment

                    if (type === 'url') {

                        const Base64Content = await axios.get(attachment.url, {
                            responseType: 'arraybuffer'
                        })
                            .then(response => Buffer.from(response.data, 'binary').toString('base64'))

                        return {
                            ContentType: attachment.contentType,
                            Filename: attachment.filename,
                            Base64Content
                        }
                    }

                    return {
                        ContentType: attachment.contentType,
                        Filename: attachment.filename,
                        Base64Content: attachment.base64content
                    }
                })
            )

            const payload = {
                CustomID: id,
                From: {
                    Email: ctx.channel.config.MAILJET_API_FROM_EMAIL,
                    Name: from ? from.name : ctx.channel.config.MAILJET_API_FROM_NAME
                },
                Subject: subject,
                TextPart: 'text part',
                HTMLPart: body
            }

            if (Attachments.length) {
                payload.Attachments = Attachments
            }

            if (to.length) {

                payload.To = to.map(({ name, email }) => ({
                    Name: name,
                    Email: email
                }))
            }

            if (cc.length) {

                payload.Cc = cc.map(({ name, email }) => ({
                    Name: name,
                    Email: email
                }))
            }

            if (bcc.length) {

                payload.Bcc = bcc.map(({ name, email }) => ({
                    Name: name,
                    Email: email
                }))
            }

            const fullResponse = await mailjet.request({
                method: 'post',
                data: {
                    Messages: [
                        payload
                    ]
                }
            })
            
            const response = fullResponse.data.Messages[0]

            return response
        }
    }
}