require('dotenv').config()
const express = require('express')
const Note = require('./models/note')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if (note) {
                res.json(note)
            } else {
                res.status(400).end()
            }
        })
        .catch(err => next(err))
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    Note.findByIdAndDelete(id)
        .then((result) => {
            res.status(204).end()
        })
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        res.json(savedNote)
    })
        .catch(e => next(e))
})

app.put('/api/notes/:id', (req, res, next) => {
    const { content, important } = req.body

    Note.findById(req.params.id)
        .then(note => {
            if (!note) {
                return res.status(404).end()
            }

            note.content = content
            note.important = important

            return note.save().then(updatedNote => {
                res.json(updatedNote)
            })
        })
        .catch(e => next(e))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }

    next(err)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
