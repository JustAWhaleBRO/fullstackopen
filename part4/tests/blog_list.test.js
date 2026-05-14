const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogHelper = require('./test_helper')

const blogs = blogHelper.initialBlogs
const listWithOneBlog = blogHelper.listWithOneBlog
const listWithNoBlogs = blogHelper.listWithNoBlog

test('dummy returns one', () => {
    const blogs = []

    const res = listHelper.dummy(blogs)
    assert.strictEqual(res, 1)
})

describe('total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {
        const res = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(res, 5)
    })

    test('test random lists', () => {
        const res = listHelper.totalLikes(blogs)
        assert.strictEqual(res, 36)
    })

    test('test empty blog list, should return 0 likes', () => {
        const res = listHelper.totalLikes(listWithNoBlogs)
        assert.equal(res, 0)
    })
})

describe('most liked blog', () => {
    test('when list has the most likes, pick that one', () => {
        const res = listHelper.favoriteBlog(blogs)
        assert.deepEqual(res, {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        },)
    })

    test('empty blog list, should return no blog', () => {
        const res = listHelper.favoriteBlog(listWithNoBlogs)
        assert.equal(res, null)
    })
})

describe('author with most blogs, and how many they are an author of', () => {
    test('author with largest amount of all blogs', () => {
        const res = listHelper.mostBlogs(blogs)
        assert.deepEqual(res, {
            author: 'Robert C. Martin',
            blogs: 3
        })
    })

    test('one blog list', () => {
        const res = listHelper.mostBlogs(listWithOneBlog)
        assert.deepEqual(res, {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('empty blog list', () => {
        const res = listHelper.mostBlogs(listWithNoBlogs)
        assert.deepEqual(res, null)
    })
})

describe('author with most likes', () => {
    test('author with most total likes overall', () => {
        const res = listHelper.mostLikes(blogs)
        assert.deepEqual(res, {
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })

    test('author with most likes with only one blog', () => {
        const res = listHelper.mostLikes(listWithOneBlog)
        assert.deepEqual(res, {
            author: 'Edsger W. Dijkstra',
            likes: 5,
        })
    })

    test('author with most likes from a list with no blogs', () => {
        const res = listHelper.mostLikes(listWithNoBlogs)
        assert.deepEqual(res, null)
    })
})
