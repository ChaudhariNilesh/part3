const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
morgan.token('data', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

let persons=[
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
      "name": "nilesh",
      "number": "123",
      "id": 4
    },
    {
      "name": "abc",
      "number": "122",
      "id": 5
    }
  ]

app.get("/api/persons",(request,response)=>{
    response.json(persons)
})

app.get("/info",(request,response)=>{
    response.send(`Phonebook has info for ${persons.length} people. <br/> ${new Date()}`)
})

app.get("/api/persons/:id",(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){

        response.json(person)
    }else{
        response.status(404).end("404 not found")
    }
    
})


app.delete("/api/persons/:id",(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        const person = persons.filter(p => p.id !== id)
        response.json(person)
    }else{
        response.status(404).end("404 not found")
    }
    
})

app.post("/api/persons/",(request,response)=>{
    const body = request.body
    if (!body.name){
        return response.status("400").json({
            "error":"person name is missing."
        })
    }else if(!body.number){
        return response.status("400").json({
            "error":"person number is missing."
        })
    }else if(persons.some(p => p.name===body.name)){
        return response.status("400").json({
            "error":"person name must be unique."
        })
    }else{
        const person = {
            "name":body.name,
            "number":body.number,
            "id":Math.floor(Math.random() * 1000) + 1
        }
        persons = persons.concat(person)
        response.json(person)
    }  
})
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)