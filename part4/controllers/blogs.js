const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (req, res) => {
    const body = req.body
    const user = req.user

    if (!user) {
        return res.status(401).json({ error: 'token invalid or missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(blog)
    await user.save()

    res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
    const user = req.user

    if (!user) {
        return res.status(401).json({ error: 'invalid token' })
    }

    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: 'unauthorized to delete this blog' })
    }

    await blog.deleteOne()
    res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
    const blog = { ...req.body }
    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        blog,
        { runValidators: true, returnDocument: 'after' }
    )
    if (updatedBlog) {
        res.json(updatedBlog)
    } else {
        res.status(404).end()
    }
})

module.exports = blogRouter
