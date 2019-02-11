const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const url = process.env.MONGO_URI
console.log('connecting to: ', url)

mongoose.connect(url, { useNewUrlParser: true }).then(respones => {
  console.log('successefully connected')
}).catch(response => {
  console.log('error connecting to mongo: ', response.message)
})

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

module.exports = mongoose.model("Entry", phoneSchema)