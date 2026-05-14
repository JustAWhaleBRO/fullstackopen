const supertest = require('supertest')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const app = require('../app')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

const api = supertest(app)

const initialBlogs = helper.initialBlogs
let token = null
let username2 = 'justwhale'
let pass2 = 'dogwalker'

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const username1 = 'root'
    const pass1 = 'sekret'
    const passwordHash1 = await bcrypt.hash(pass1, 10)
    const user1 = new User({ username: username1, passwordHash: passwordHash1 })
    await user1.save()

    const blogObjects = initialBlogs.map(blog => new Blog({
        ...blog,
        user: user1._id
    })
    )
    const savedBlogs = await Blog.insertMany(blogObjects)
    user1.blogs = savedBlogs.map(b => b._id)
    await user1.save()

    const passwordHash2 = await bcrypt.hash(pass2, 10)
    const user2 = new User({ username: username2, passwordHash: passwordHash2 })
    await user2.save()

    const res = await api
        .post('/api/login')
        .send({ username: username1, password: pass1 })

    token = res.body.token
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const res = await api.get('/api/blogs')
        assert.equal(res.body.length, initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(e => e.title)
        assert(titles.includes('React patterns'))
    })

    test('unique identifier property is named id', async () => {
        const res = await api.get('/api/blogs')
        assert.ok(res.body[0].id)
        assert.equal(res.body[0]._id, undefined)
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const newBlog = {
                title: 'How to win in life',
                author: 'Absolute Chadman',
                url: 'bechad.com',
                likes: 10001,
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.equal(blogsAtEnd.length, initialBlogs.length + 1)

            const contents = blogsAtEnd.map(b => b.title)
            assert(contents.includes('How to win in life'))
        })

        test('if likes property is missing, it defaults to 0', async () => {
            const newBlog = {
                title: 'This is a completely new blog',
                author: 'Jackson Storm',
                url: 'JCKStorm.com'
            }

            const res = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(res.body.likes, 0)

            const blogsAtEnd = await helper.blogsInDb()
            const addedBlog = blogsAtEnd.find(b => b.title === 'This is a completely new blog')
            assert.strictEqual(addedBlog.likes, 0)
        })

        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: 'Michael Jackson',
                url: 'michaeljackson.com'
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
        })

        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: 'Eeeah haaa',
                author: 'Michael Jackson',
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
        })

        test('fails with status code 401 if token is not provided', async () => {
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
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid and is creator', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

            const ids = blogsAtEnd.map(b => b.id)
            assert(!ids.includes(blogToDelete.id))
        })

        test('should not succeed if user is not creator', async () => {
            const res = await api
                .post('/api/login')
                .send({ username: username2, password: pass2 })

            const token2 = res.body.token
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token2}`)
                .expect(403)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })

        test('should not succeed if user token is invalid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', 'Bearer michaeljackson')
                .expect(401) // jwt error handler converts JsonWebTokenError to 401

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
        })

    })

    describe('updating a blog', () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlog = {
                ...blogToUpdate,
                likes: blogToUpdate.likes + 100
            }

            const res = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(res.body.likes, blogToUpdate.likes + 100)

            const blogsAtEnd = await helper.blogsInDb()
            const foundBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
            assert.strictEqual(foundBlog.likes, blogToUpdate.likes + 100)
        })
    })

})

after(async () => {
    await mongoose.connection.close()
})
