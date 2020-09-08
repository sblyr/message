import axios from 'axios'
import getSession from '@sublayer/passport-components/lib/getSession'

export default axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    transformRequest: [function (data, headers) {

        const session = getSession()

        if (session) {
            headers['Authorization'] = `Bearer ${session}`
        }

        return data;
    }],
})