const express = require('express')
const signApi = express.Router()
const connection = require('./database.js')

//Signin Data and Save To MongoDb Database
signApi.post('/registerUsers', async (req, res) => {
  console.log('Node Data Sign', req.body)
  const { Name , Email , Password } = req.body

  if ( !Name || !Email || !Password) {
       res.status(324).send({ msg : 'Fill all detials'})
  }
   
  try {
    if ( connection.query('SELECT * FROM userstable WHERE Email = ?', Email)) {
        res.status(323).send({ msg : 'User Already Exits'})
    } else {
        connection.query('INSERT INTO userstable SET ? ' ,{ Name ,Email ,Password})
        res.status(200).send({ msg : 'Data Add Succesfully'})
    }
   
  } catch (error) {
       console.log('dfsd' , error)
       res.status(402).send({ msg : error})
  }
  
})

module.exports = signApi