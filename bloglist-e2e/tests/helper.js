const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(title)
  await page.getByRole('textbox', { name: 'author' }).fill(author)
  await page.getByRole('textbox', { name: 'url' }).fill(url)
  await page.getByRole('button', { name: 'create blog' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

// clicks the "like" button on a blog until it reaches `times` likes,
// waiting for each increment so the async updates don't get lost
const likeBlog = async (page, blogText, times) => {
  const blogElement = page.getByText(blogText)
  await blogElement.getByRole('button', { name: 'view' }).click()
  for (let i = 1; i <= times; i++) {
    await blogElement.getByRole('button', { name: 'like' }).click()
    await blogElement.getByText(String(i)).waitFor()
  }
}

module.exports = { loginWith, createBlog, likeBlog }
