const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  },
  {
    name: "asd",
    number: "123",
    id: 5
  },
  {
    name: "as",
    number: "123",
    id: 6
  },
  {
    name: "asd4",
    number: "123",
    id: 7
  },
  {
    name: "asd1a",
    number: "123",
    id: 8
  },
  {
    name: "asd123",
    number: "asd",
    id: 9
  },
  {
    name: "qwe",
    number: "123",
    id: 10
  },
  {
    name: "asd123",
    number: "123",
    id: 11
  }
]
app.get('/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(p => p.id === id)
  console.log(person)
  res.json(person)
})
app.get("/persons", (req, res) => {
  res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})