const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }
]

const listWithNoBlogs = []

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
