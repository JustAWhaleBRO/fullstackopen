const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'JACK',
        name: 'BIG BOSS',
        password: 'salainen',
      },
    })
    await request.post('/api/users', {
      data: {
        username: 'JILL',
        name: 'SECOND USER',
        password: 'salainen',
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameField = page.getByLabel('username:')
    const passwordField = page.getByLabel('password:')
    const loginTitle = page.getByText('Log Into Application')
    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(usernameField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(loginTitle).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('Succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'JACK', 'salainen')
      await expect(page.getByText('BIG BOSS logged in')).toBeVisible()
    })
    
    test('Fails with incorrect credentials', async ({ page }) => {
      await loginWith(page, 'whatsup', 'hello')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'JACK', 'salainen')
    })
    
    test('A new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test url')
      await expect(page.getByText('test title test author')).toBeVisible()
    })

    describe('And a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog to like', 'some author', 'http://example.com')
      })

      test('The blog can be liked', async ({ page }) => {
        const blogElement = page.getByText('a blog to like some author')
        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(blogElement.getByText('0')).toBeVisible()
        await blogElement.getByRole('button', { name: 'like' }).click()
        await expect(blogElement.getByText('1')).toBeVisible()
      })

      test('The user who added the blog can delete it', async ({ page }) => {
        const blogElement = page.getByText('a blog to like some author')
        await blogElement.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('a blog to like some author')).not.toBeVisible()
      })

      test('Only the user who added the blog sees its delete button', async ({ page }) => {
        const blogElement = page.getByText('a blog to like some author')
        await blogElement.getByRole('button', { name: 'view' }).click()
        await expect(blogElement.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'JILL', 'salainen')

        const blogElementAsJill = page.getByText('a blog to like some author')
        await blogElementAsJill.getByRole('button', { name: 'view' }).click()
        await expect(blogElementAsJill.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })

    describe('And several blogs with different likes exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'least liked', 'author a', 'http://a.com')
        await createBlog(page, 'most liked', 'author b', 'http://b.com')
        await createBlog(page, 'middle liked', 'author c', 'http://c.com')

        await likeBlog(page, 'most liked author b', 3)
        await likeBlog(page, 'middle liked author c', 2)
        await likeBlog(page, 'least liked author a', 1)
      })

      test('Blogs are ordered by likes, most liked first', async ({ page }) => {
        const blogs = await page.locator('.blog').all()

        // extract the title text of each rendered blog in DOM order
        const titles = await Promise.all(
          blogs.map(blog => blog.innerText())
        )

        expect(titles[0]).toContain('most liked')
        expect(titles[1]).toContain('middle liked')
        expect(titles[2]).toContain('least liked')
      })
    })
  })
})