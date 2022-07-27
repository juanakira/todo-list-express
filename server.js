// Required packages 
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// Connecting to the Database
    // Setting variables that you're going to use later
    // connection string is pulled from the .env file in dev, from environment vars that you set in Heroku etc
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    // using the 'connect' method on the mongoclient object with the 'dbConnectionString as param
    // https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#db
    // https://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // console.log(client)
        console.log(`Connected to ${dbName} Database`)
        // Setting the variable 'db' that you created before to the 'db' method with the dbName argument of the 'client' object that you got back
        db = client.db(dbName)
    })

// Setting up the middleware     

app.set('view engine', 'ejs')
    // Set the 'public' directory as the directory for static files
app.use(express.static('public'))
    // Set up middleware for express to parse PUT / POST requests as object/JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


// Server functions

    // Get at Root
app.get('/',async (request, response)=>{
    // Async/await of doing it
        // Get the todos from the collection 'todos' in the database, and turns them into an array
    const todoItems = await db.collection('todos').find().toArray()
        // get the number of items that are left
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
        // Render the 'index.ejs' file passing it the objects you've retrieved from the db
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // Promise chaining way of doing it
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})


    // POST at '/addTodo'
app.post('/addTodo', (request, response) => {
    // uses the Mongo insertOne method to create a new element in the DB
    // the 'thing' property has the value of the 'todoItem' text input, and isn't completed by default
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    // when finished, it logs 'Todo Added' to the console and redirects you to the root page, reloading it
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

    // PUT at /markComplete
app.put('/markComplete', (request, response) => {
    // using the Mongo 'updateOne' method to update the item that coincides with the text
        // db.collection.updateOne(<filter>, <update>, {})
    db.collection('todos').updateOne(
        // filter: updates the collection using the 'itemFromJS' text that the frontend passed while making the request
    {  
        thing: request.body.itemFromJS
    },
        // update: uses the '$set' update operator to change the value of the 'completed' field to 'true'       
    {
        $set: {
            completed: true
          }
    },
        // rest of params
    {
        // not sure what this does, it's not in the docs, seems to work fine without this
        // i think this 'sort' param is used in the findOneAndUpdate method, and is mistakingly being used here
        sort: {_id: -1},
        // upsert when true creates a new document if nothing matches the query
        upsert: false
    })
    // when the promises resolves, it logs and responds to the client with "Marked Complete" (the client/frontend will then log that response too )
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})
    // PUT at /markComplete
app.put('/markUnComplete', (request, response) => {

    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },
    
    {
        // not sure what this does, it's not in the docs, seems to work fine without this
        // i think this 'sort' param is used in the findOneAndUpdate method, and is mistakingly being used here
        sort: {_id: -1},
    // upsert when true creates a new document if nothing matches the query
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})