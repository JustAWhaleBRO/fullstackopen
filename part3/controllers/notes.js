const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

notesRouter.get('/:id', (res, req, next) => {
    Note.findById(req.params.id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch(e => next(e))
})

notesRouter.post('/', (req, res, next) => {
    const body = req.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })

    note.save()
        .then(savedNote => {
            res.json(savedNote)
        })
        .catch(e => next(e))
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

notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then(deletedNote => {
            if (!deletedNote) {
                return res.status(404).end()
            }
            return res.status(204).end()
        })
        .catch(e => next(e))
})

module.exports = notesRouter
