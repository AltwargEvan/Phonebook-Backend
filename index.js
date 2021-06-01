const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('data', function getData (req) {
    if(req.method != 'POST') {
        return null
    }
    return JSON.stringify({name: req.body.name, number: req.body.number})
})
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['data'](req)
    ].join(' ')
}))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send('<div><p>Phonebook has info for ' + persons.length + ' people</p>' + Date().toString() + '<div>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if(!person.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if(!person.number) {
        return response.status(400).json({error: 'number missing'})
    }
    if(persons.find(thePerson => thePerson.name === person.name)) {
        return response.status(400).json({error: 'person with this name already exists'})
    }
    let id = Math.floor(Math.random() * 1000)
    while (persons.find(aPerson => aPerson.id === id)) {
        id = Math.floor(Math.random() * 1000)
        console.log('Generated ID is already in use. Generating a new ID')
    }
    person.id = id
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
