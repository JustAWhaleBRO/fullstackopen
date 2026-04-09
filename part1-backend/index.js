const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const currentTime = new Date().toString()
    const entryCount = persons.length
    res.send(`
        <p>Phonebook has info for ${entryCount} people</p>
        <p>${currentTime}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
        console.log(`Deleted ${person.name}`)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

const generateId = () => (
    String(Math.floor(Math.random() * 10000))
)

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const nameExists = persons.some(p => p.name === body.name)
    if (nameExists) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const personObj = {
        "id": generateId(),
        "name": body.name,
        "number": body.number
    }

    persons = persons.concat(personObj)
    res.json(personObj)
})

const unknownEndpoint = (req, res) => {
    res.status(404).json({
        error: 'unknown endpoint'
    })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


