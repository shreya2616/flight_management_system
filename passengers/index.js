const express = require('express')
const axios = require('axios')
const mysql = require('mysql2')

const app= express()

app.use(express.json())
const PORT = 3033

const db = mysql.createConnection({
    host:'localhost',
    port : 3306,
    user : 'root',
    password : 'pass@word1',
    database : 'passengers'
})

db.connect((err) => {
    if(err){
        throw err
    }
    else{
        console.log("Mysql connected")
    }
})

//end point to save all the passengers to the database
app.post('/passengers' , (req,res) => {
    const {name, email, flightId} = req.body;
    db.query(`insert into passenger_info (name, email, flightId) values (?,?,?)`
        ,[name,email,flightId]
        ,(err,result) => {
            if(err){
                res.status(500).json(err)
            }
            else{
                res.status(201).json("Passenger added successfully")
            }
        }
    )
})

//end point to get all the passengers from the database
app.get('/passengers' , (req,res) =>{
    db.query(`Select * from passenger_info` , (err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.status(200).json(result)
        }
    })
})

//end point to retrieve the passenger by id
app.get('/passengers/:id' , (req,res) => {
    db.query(`Select * from passenger_info where id = ?` ,[req.params.id] , (err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.status(200).json(result)
        }
    })
})

//end point to retrieve all the passnger by flight id
app.get('/passengers/flight/:flightId' , (req,res) => {

    const flight_id = req.params.flightId
    db.query('Select * from passenger_info where flightId = ?' , [flight_id] , (err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else if(result.length ==0){
            res.status(404).json({message: "Passengers not found in this flight"})
        }
        else{
            res.status(200).json(result)
        }
    })
})

app.listen(PORT,() =>{
    console.log(`Passengers is listening to port ${PORT}`)
})