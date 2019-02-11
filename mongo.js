const mongoose = require("mongoose")

const add_to_db = () => {
  const name = process.argv[3]
  const number = process.argv[4]
  const entry = new Entry({
    name: name,
    number: number
  })

  entry.save().then(response => {
    console.log("lisätään ", name, " numero ", number, "luettoon")
    mongoose.connection.close()
  })
}

const listings = () => {
  Entry.find({}).then(result => {
    result.forEach(e => {
      console.log(e.name, ' ', e.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 3) {
  console.log("password required")
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb://admin:${password}@full-stack-shard-00-00-e52u1.mongodb.net:27017,full-stack-shard-00-01-e52u1.mongodb.net:27017,full-stack-shard-00-02-e52u1.mongodb.net:27017/test?ssl=true&replicaSet=full-stack-shard-0&authSource=admin&retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })
const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})
phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Entry = mongoose.model("Entry", phoneSchema)

if (process.argv.length === 5) {
  add_to_db()
} else {
  listings()
}
