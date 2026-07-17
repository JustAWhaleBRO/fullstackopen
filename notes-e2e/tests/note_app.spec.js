const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper")

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    
    await page.goto("/")
  })

  test("Front page can be opened", async ({ page }) => {
    const locator = page.getByText("Notes");
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        "Note app, Department of Computer Science, University of Helsinki 2025",
      ),
    ).toBeVisible();
  });

  test("User can log in", async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
  });

  test("Login fails with wrong password", async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrongpassword')
    
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe("When user is logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test("A new note can be created", async ({ page }) => {
      const noteContent = "note created by playwright"
      await createNote(page, noteContent)
      await expect(page.getByText(noteContent)).toBeVisible()
    })

    describe('And a note exists', () => {
      beforeEach(async ({ page }) => {
        const noteContent = 'another note by playwright'
        await createNote(page, noteContent)
      })

      test('Importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })

      describe('And several notes exists', () => {
        beforeEach(async ({ page }) => {
          await createNote(page, 'first note')
          await createNote(page, 'second note')
          await createNote(page, 'third note')
        })

        test('One of those can be made non-important', async ({ page }) => {
          await page.pause()
          const otherNoteElement = page.getByText('second note').locator('..')
          
          await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
          await expect(otherNoteElement.getByText('make important')).toBeVisible()
        })
      })
    })
    
  })
});
