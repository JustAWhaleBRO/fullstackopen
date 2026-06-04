import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import CreateForm from './components/BlogCreateForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
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

  const loginForm = () => (
    <LoginForm handleLogin={handleLogin} />
  )

  const createBlog = async blogObj => {
    try {
      createFormRef.current.toggleVisibility()
      const resp = await blogService.create(blogObj)
      setBlogs(blogs.concat(resp))
      setSuccessMessage(`a new blog ${blogObj.title} by ${blogObj.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (e) {
      setErrorMessage('Failed to add blog')
      console.log(e)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async blogObj => {
    const resp = await blogService.update(blogObj)
    setBlogs(blogs.map(blog => (
      blog.id !== blogObj.id ? blog : resp
    )))
  }

  const deleteBlog = async blogId => {
    await blogService.deleteBlog(blogId)
    setBlogs(blogs.filter(blog => blog.id !== blogId))
  }

  const createFormRef = useRef()

  const createForm = () => (
    <Togglable buttonLabel='create new blog' ref={createFormRef}>
      <CreateForm createBlog={createBlog} />
    </Togglable>
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

  const sortedBlogs = [...blogs].sort((a, b) => (
    b.likes - a.likes
  ))

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
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          blogOwnerId={user.id}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      )}
    </div>
  )
}

export default App
