const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

const app = express()
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]
morgan.token("content", req => {
  if (req.method === "POST") {
    const body = req.body
    return JSON.stringify(body)
  }
  return ' '
})
app.use(bodyParser.json())
app.use(morgan(":method :url - - :response-time ms :content"))
app.use(cors())

app.get("/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(p => p.id === id)
  console.log(person)
  res.json(person)
})

app.get("/persons", (req, res) => {
  res.json(persons)
})

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0
  return maxId + 1
}

app.post("/persons", (request, response) => {
  const body = request.body
  if (body === undefined) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  if (persons.find(person => person.name === body.name) === undefined) {
    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }

    persons.push(person)
    response.json(person)
  } else {
    response.status(403).json({
      error: "name must be unique"
    })
  }
})

app.get("/info", (request, response) => {
  const people = persons.length
  const date = Date.now()
  response.end("puhelin luettelussa on " + people + " henkilöä\n" + date)
})

app.delete("/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(persons)
  console.log(`listening on ${PORT}`)
})
