const { test, describe, after, beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper.js')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    let token = null
    let username = 'root'

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username, name: 'root', passwordHash })

        await user.save()

        const res = await api
            .post('/api/login')
            .send({ username: 'root', password: 'sekret' })

        token = res.body.token
    })

    test('creation succeeds with a fresh name and password', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length - 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails when username already taken', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'root',
            password: 'meow'
        }

        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length)
        assert(res.body.error.includes('expected `username` to be unique'))
    })

    test('creation fails when missing password', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'camile',
            name: 'Camile'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length)
    })

    test('creation fails when missing username', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Camile',
            password: '123123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length)
    })

    test('creation fails when password length < 3', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'camile',
            name: 'Camile',
            password: '12'
        }

        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length)
        assert(res.body.error
            .includes('password must be at least 3 characters long')
        )
    })

    test('creation fails when username length < 3', async () => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ca',
            name: 'Ca',
            password: '0000'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtStart.length, usersAtEnd.length)
    })

    test('POST a blog with missing token', async () => {
        const initialBlogs = await helper.blogsInDb()

        const newBlog = {
            title: 'This should fail',
            author: 'Hacker',
            url: 'hacker.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(initialBlogs.length, blogsAtEnd.length)
    })

    test('a new user POST blog with a valid token', async () => {
        const password = 'sekret'
        const username = 'demo'
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({ username, name: username, passwordHash })

        await user.save()

        const res = await api
            .post('/api/login')
            .send({ username, password })

        const temp_token = res.body.token

        const initialBlogs = await helper.blogsInDb()

        const newBlog = {
            title: 'Absolutely valid blog',
            author: 'Absolute Chadman',
            url: 'bechad.com',
            likes: 999
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${temp_token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

        const contents = blogsAtEnd.map(b => b.title)
        assert(contents.includes(newBlog.title))

        const createdBlog = blogsAtEnd.find(b => b.title === newBlog.title)
        assert.strictEqual(createdBlog.user.toString(), user.id.toString())
    })
})

after(async () => {
    await mongoose.connection.close()
})
