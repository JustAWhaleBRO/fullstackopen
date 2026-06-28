import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Note from './Note'
import Togglable from './Togglable'

test('renders content', () => {
  const content = 'Component testing is done with React Testing Library'
  const note = {
    content: content,
    importance: true,
  }

  const mockHandler = vi.fn()
  render(<Note note={note} toggleImportance={mockHandler}/>)

  const element = screen.getByText(content)
  expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  
  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)
  expect(mockHandler).toHaveBeenCalledTimes(1)
})

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show...">
        <div>togglable content</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start togglable content is not displayed', () => {
    const element = screen.getByText('togglable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking the button, the children are visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('togglable content')
    expect(element).toBeVisible()
  })
})
