import { useState } from 'react'

const CreateForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = async event => {
    event.preventDefault()

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create New</h2>
      <div>
        <form onSubmit={addBlog}>
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
}

export default CreateForm
