import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreateForm from './BlogCreateForm'

test('<BlogCreateForm /> calls createBlog with the right details on submit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogCreateForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:', { exact: false })
  const authorInput = screen.getByLabelText('author:', { exact: false })
  const urlInput = screen.getByLabelText('url:', { exact: false })
  const createButton = screen.getByText('create blog')

  const title = 'Testing forms with React Testing Library'
  const author = 'Jane Doe'
  const url = 'https://example.com'

  await user.type(titleInput, title)
  await user.type(authorInput, author)
  await user.type(urlInput, url)
  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title,
    author,
    url,
  })
})
