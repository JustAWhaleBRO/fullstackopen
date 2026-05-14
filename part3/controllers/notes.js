const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

notesRouter.get('/', async (req, res) => {
    const notes = await Note
        .find({}).populate('user', { username: 1, name: 1 })
    res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

const getTokenFrom = req => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

notesRouter.post('/', async (req, res) => {
    const body = req.body
    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return res.status(400).json({ error: 'userId missing or not valid' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
})

notesRouter.put('/:id', (req, res, next) => {
    const id = req.params.id
    const { content, important } = req.body

    Note.findByIdAndUpdate(
        id,
        { content, important },
        { returnDocument: 'after', runValidators: true }
    )
        .then(updatedNote => {
            if (updatedNote) {
                return res.json(updatedNote)
            }
            return res.status(404).end()
        })
        .catch(e => next(e))
})

notesRouter.delete('/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

module.exports = notesRouter
