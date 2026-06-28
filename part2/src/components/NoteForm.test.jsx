import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import NoteForm from './NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(
    <NoteForm createNote={createNote} />
  )
  
  const input = screen.getByPlaceholderText('write note content here...')
  await user.type(input, 'testing a form...')
  
  const sendButton = screen.getByText('save')
  await user.click(sendButton)

  expect(createNote).toHaveBeenCalled(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})