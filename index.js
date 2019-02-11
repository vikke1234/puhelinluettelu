require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

morgan.token("content", req => {
  if (req.method === "POST") {
    const body = req.body
    return JSON.stringify(body)
  }
  return " "
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)
app.use(bodyParser.json())
app.use(morgan(":method :url - - :response-time ms :content"))
app.use(cors())
app.use(express.static("build"))

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  }).catch(err =>{
    console.log(err.message)
    response.status(400).end()
  })
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (body === undefined) {
    return response.status(400).json({
      error: "content missing"
    })
  }
  if (body.name.length < 3 || body.number.length < 8) {
    return response.status(400).end()
  }
    console.log(body)
  Person.findOne({ name: body.name }, (err, results) => {
    if (err) {
      console.log(err)
    }

    if (!results) {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person
        .save()
        .then(res => {
          response.json(person)
        })
        .catch(err => console.log(err.message))
    } else {
      response.status(403).json({
        error: "name must be unique"
      })
    }
  })
})

app.put('/api/persons/:id', (request, response) => {
  let body = request.body
  if(!body) {
    console.log('error no content')
    response.status(204).end()
  }
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true}).then(updated_person => {
    response.json(updated_person.toJSON())
  }).catch(err => console.log(err.message))
})
app.get("/info", (request, response) => {
  const people = Person.find({}).then(people => {
    const date = Date.now()
    response.end("puhelin luettelussa on " + people.length + " henkilöä\n" + date)
  })
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove({_id: request.params.id}).then(result => {
    response.status(204).end()
  }).catch(err => console.log(err.message))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
