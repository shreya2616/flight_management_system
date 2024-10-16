const express = require("express")
const mysql = require("mysql2")
const axios = require("axios")

const app = express()

app.use(express.json())
const PORT = 3032

const db = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"pass@word1",
    database:"flights"
})

db.connect((err) => {
    if(err){
        throw err
    }
    else{
        console.log("Mysql connected")
    }
})

//end point to save the information of flights in the database
app.post('/flights' , (req,res) => {
    const {name, airlineId, category} = req.body
    db.query('insert into flight_info (name, airlineId, category) values (?,?,?)',[name,airlineId,category],(err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.status(201).json({message: "Flights added successfully"})
        }
    })
})

//end point to get all the information of the flights
app.get('/flights' , (req,res) => {
    db.query('select * from flight_info' , (err,result) => {
        if(err){
            res.status(500).json(console.log(err))
        }
        else{
            res.status(200).json(result)
        }
    })
})

//end point to get the information of flight based on id
app.get('/flights/:id' , (req,res) => {
    db.query('select * from flight_info where id = ?' , [req.params.id], (err,result) => {
        if(err){
            res.status(500).json(console.log(err))
        }
        else{
            res.status(200).json(result)
        }
    })
})

//end point to get the flights based on airline Id
app.get('/flights/airline/:airlineId', (req, res) => {
    const airlineId = req.params.airlineId;

    db.query('SELECT * FROM flight_info WHERE airlineId = ?', [airlineId], (err, results) => {
        if (err) {
            res.status(500).json(err);
        } else if (results.length === 0) {
            res.status(404).json({ message: "No flights found for this airline" });
        } else {
            res.status(200).json(results);
        }
    });
});

//end point to get all the passengers by flight Id
app.get('/flights/passenger/:id' , async (req,res) => {
    const id = req.params.id
    try{
        const result = await axios.get(`http://localhost:3033/passengers/flight/${id}`)
        res.status(200).json(result.data)
    }catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json(console.log(error));
        }
    }
})

app.listen(PORT, ()  => {
    console.log(`Flight listening to port ${PORT}`)
})