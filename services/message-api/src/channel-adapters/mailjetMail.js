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
        send: async ({ id, attention, to, cc, subject, body, attachments }) => {

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
                    Name: ctx.channel.config.MAILJET_API_FROM_NAME
                },
                To: [{
                    Email: to,
                    Name: attention
                }],
                Subject: subject,
                TextPart: 'text part',
                HTMLPart: body
            }

            if (Attachments.length) {
                payload.Attachments = Attachments
            }

            if (cc) {

                payload.Cc = cc.split(',').map(email => ({
                    Email: email,
                    Name: email
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