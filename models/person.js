const mongoose = require('mongoose')
const  uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGO_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result =>{
        console.log('connected to MongoDB')
        
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })


    const personSchema = new mongoose.Schema({
      name: {
        type:String,
        minLength: [3, "Person Name should be atleast 3 character long."],
        required: [true, "Person Name field should not be empty"],
        unique: true,
        uniqueCaseInsensitive: true
        },
      number: {
        type:String,
        minLength: [8, "Person Number should be atleast 8 character long."],
        required: [true, "Person Number field should not be empty"],
        unique: true,
      }
    })
  
    personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Person', personSchema)
