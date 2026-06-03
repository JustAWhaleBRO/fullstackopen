import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (err) {
      console.log(err)
      setErrorMessage('Wrong Crendentials!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    setErrorMessage('User Logged Out')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const createBlog = async event => {
    event.preventDefault()

    try {
      const blogObject = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      }

      const resp = await blogService.create(blogObject)
      setBlogs(blogs.concat(resp))
      setSuccessMessage(`a new blog ${blogTitle} by ${blogAuthor} added`)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (e) {
      setErrorMessage('Failed to add blog')
      console.log(e)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username:
            <input
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const createForm = () => (
    <div>
      <h2>Create New</h2>
      <div>
        <form onSubmit={createBlog}>
          <div>
            <label>
              title:
              <input
                type='text'
                value={blogTitle}
                onChange={({ target }) => setBlogTitle(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              author:
              <input
                type='text'
                value={blogAuthor}
                onChange={({ target }) => setBlogAuthor(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                type='text'
                value={blogUrl}
                onChange={({ target }) => setBlogUrl(target.value)}
              />
            </label>
          </div>
          <button type='submit'>create blog</button>
        </form>
      </div>
    </div>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log Into Application</h2>
        <Notification message={errorMessage} type="error" />
        <Notification message={successMessage} type="success" />
        {loginForm()}

      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {createForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
