const mongoose = require('mongoose')
const  uniqueValidator = require('mongoose-unique-validator');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else {
  const password = process.argv[2]

  const url =
    `mongodb+srv://fullstackDemo:${password}@cluster0.nnetq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  const personSchema = new mongoose.Schema({
    name: {
      type:String,
      minLength: 3,
      required: true,
      unique: true
      },
    number: {
      type:String,
      minLength: 8,
      required: true,
      unique: true}
  })

  personSchema.plugin(uniqueValidator);

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 3) {
    Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })

  } else {
    console.log('Please provide the name and number as an argument: node mongo.js <password> [name] | "[name]" [number]')
    process.exit(1)
  }

}


