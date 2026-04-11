require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

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

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const currentTime = new Date().toString()
    Person.countDocuments({}).then(entryCount => {
        res.send(`
            <p>Phonebook has info for ${entryCount} people</p>
            <p>${currentTime}</p>
        `)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
        .catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(person => {
            if (person) {
                console.log(`Deleted ${person.name}`)
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        })
        .catch(e => next(e))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const newPerson = new Person({
        "name": body.name,
        "number": body.number
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const { name, number } = req.body

    Person.findById(id)
        .then(person => {
            if (!person) {
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(savedPerson => {
                res.json(savedPerson)
            })
        })
        .catch(e => next(e))
})

const unknownEndpoint = (req, res) => {
    res.status(404).json({
        error: 'unknown endpoint'
    })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.log(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({
            error: 'malformatted id'
        })
    }
    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


