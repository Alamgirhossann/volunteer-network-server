const express = require('express')
const bodyParser= require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 4000



var MongoClient = require('mongodb').MongoClient;

var uri =`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.s5oej.mongodb.net:27017,cluster0-shard-00-01.s5oej.mongodb.net:27017,cluster0-shard-00-02.s5oej.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-13pfab-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri, function(err, client) {
  const registerCollection = client.db(`${process.env.DB_NAME}`).collection("regInfo");
  const userCollection = client.db(`${process.env.DB_NAME}`).collection("userInfo");

  app.get('/volunteerEvent',(req, res)=>{
    registerCollection.find({})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.get('/registeredUser',(req, res)=>{
    const verifyEmail = req.headers.authorization;
    console.log(verifyEmail);
    userCollection.find({email: req.query.email})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.post('/volunteerEvents',(req, res)=>{
    const event = req.body;
    registerCollection.insertOne(event)
    .then(result => {
      console.log(result);
    })
  })

  app.post('/registration',(req, res)=>{
    const regForm = req.body;
    console.log(regForm);
    userCollection.insertOne(regForm)
    .then(result => {
      console.log(result);
    })
  })

  app.get('/registeredEvent', (req, res)=>{
    userCollection.find({})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    console.log(req.params.id)
    userCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result);
      res.send(result.deletedCount > 0)
    })
  })

  console.log('database connected');
});



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://volunteer:volunteerNetwork50@cluster0.s5oej.mongodb.net/dbVolunteer?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const registerCollection = client.db("dbVolunteer").collection("regInfo");
//   const userCollection = client.db("dbVolunteer").collection("userInfo");

//   app.get('/volunteerEvent',(req, res)=>{
//     registerCollection.find({})
//     .toArray((err, document)=>{
//       res.send(document)
//     })
//   })

//   // app.get('/registeredUser',(req, res)=>{
//   //   userCollection.find({email: req.query.email})
//   //   .toArray((err, document)=>{
//   //     res.send(document)
//   //   })
//   // })

//   // app.post('/volunteerEvents',(req, res)=>{
//   //   const event = req.body;
//   //   registerCollection.insertOne(event)
//   //   .then(result => {
//   //     console.log(result);
//   //   })
//   // })

//   app.post('/registration',(req, res)=>{
//     const regForm = req.body;
//     console.log(regForm);
//     userCollection.insertOne(regForm)
//     .then(result => {
//       console.log(result);
//     })
//   })

//   app.get('/registeredEvent', (req, res)=>{
//     userCollection.find({})
//     .toArray((err, document)=>{
//       res.send(document)
//     })
//   })

//   app.delete('/delete/:id', (req, res)=>{
//     console.log(req.params.id)
//     userCollection.deleteOne({_id: ObjectId(req.params.id)})
//     .then(result => {
//       console.log(result);
//       res.send(result.deletedCount > 0)
//     })
//   })


// });


app.get('/', (req, res) => {
  res.send('Hello Volunteers. We are working together!')
})

app.listen(port)