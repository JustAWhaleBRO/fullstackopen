import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'ILoveDogs',
    author: 'dog123',
    url: 'dog.com',
    likes: 7,
    id: '123',
    user: {
      id: '456',
      name: 'dog'
    }
  }
  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()
  const blogOwnerId = 'root'

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        blogOwnerId={blogOwnerId}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
      />
    )
  })

  test('by default only title and author are shown', () => {
    expect(screen.getByText(blog.title, { exact: false })).toBeVisible()
    expect(screen.getByText(blog.author, { exact: false })).toBeVisible()

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(blog.likes)).toBeNull()
  })

  test('blog url and likes are shown after clicking the view button', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blog.likes))
    expect(screen.getByText(blog.url))
  })

  test('clicking the like button twice increments likes by 2', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog).toHaveBeenCalledTimes(2)
  })

})