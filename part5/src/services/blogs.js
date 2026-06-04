import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const config = () => (
  {
    headers: { Authorization: token },
  }
)

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const resp = await axios.post(baseUrl, newBlog, config())
  return resp.data
}

const update = async blog => {
  const resp = await axios.put(`${baseUrl}/${blog.id}`, blog, config())
  return resp.data
}

const deleteBlog = async blogId => {
  const resp = await axios.delete(`${baseUrl}/${blogId}`, config())
  return resp.data
}

export default { getAll, setToken, create, update, deleteBlog }
