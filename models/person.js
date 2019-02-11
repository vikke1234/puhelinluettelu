const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGO_URI
console.log('connecting to: ', url)

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(response => {
    console.log('successefully connected')
  })
  .catch(err => {
    console.log('error connecting to mongo: ', err.message)
  })

const phoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: String, required: true }
})
phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', phoneSchema)