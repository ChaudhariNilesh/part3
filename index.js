/*eslint-env es6*/
require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
  
    next(error)
  }
  

app.get("/api/persons",(request,response)=>{
    Person.find({}).then(result => {
            response.json(result)
      }).catch(error => {
          console.log(error);
      })

})

app.get("/info",(request,response)=>{
    Person.estimatedDocumentCount({},function(err,rst){
        if(err){
            console.log(err);
            response.status(500).end()
        }else{
            response.send(`Phonebook has info for ${(rst)} people. <br/> ${new Date()}`)
        }
    })
})


app.get("/api/persons/:id",(request,response,next)=>{
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
    
})


app.delete("/api/persons/:id",(request,response,next)=>{
    const id = request.params.id
    Person.findById(id).then(person => {
        if(person){
            Person.findByIdAndRemove(id).then(result => {
                response.status(204).end()
            }).catch(error => next(error))

        }else{
            return response.status(400).end("Person not exists in the phonebook")
        }
    }).catch(error => next(error))
    
})

app.post("/api/persons/",(request,response,next)=>{
    const body = request.body
    const person = new Person({
        "name":body.name,
        "number":body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => {
        console.log(error);
        next(error);
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
        "name":body.name,
        "number":body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true,runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)