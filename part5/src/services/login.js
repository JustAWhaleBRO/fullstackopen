import axios from 'axios'
const url = '/api/login'

const login = async credentials => {
    const resp = await axios.post(url, credentials)
    return resp.data
}

export default { login }
