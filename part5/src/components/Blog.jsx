import { useState } from 'react'

const Blog = ({ blog, blogOwnerId, updateBlog, deleteBlog }) => {
  const [expand, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const removeButtonStyle = {
    backgroundColor: '#008CB0',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    padding: '3px 8px',
    cursor: 'pointer'
  }

  const addLike = () => {
    updateBlog({ ...blog, user: blog.user.id, likes: blog.likes + 1 })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setExpanded(!expand)}>
        {expand ? 'hide' : 'view'}
      </button>
      {expand && (
        <div>
          <div>{blog.url}</div>
          <div>{blog.likes}<button onClick={() => addLike()}>like</button></div>
          <div>{blog.user.name}</div>
          {blogOwnerId === blog.user.id && (
            <button onClick={handleRemove} style={removeButtonStyle}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
