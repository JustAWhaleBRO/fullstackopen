import { useState } from 'react'

const Blog = ({ blog, blogOwnerId, updateBlog, deleteBlog }) => {
  const [expand, setExpanded] = useState(false)

  const addLike = () => {
    updateBlog({ ...blog, user: blog.user.id, likes: blog.likes + 1 })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div className="blog">
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
            <button onClick={handleRemove} className="remove-button">remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
