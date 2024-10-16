const express = require("express")
const mysql = require("mysql2")
const cors = require('cors');
const axios = require('axios')

const app = express();
const PORT = 3031;

app.use(express.json())



app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    port : 3306,
    user : "root",
    password : "pass@word1",
    database : "airlines"
})

db.connect((error) => {
    if(error){
        throw error
    }
    else{
    console.log("MySQL connected!!")
    }
})

//end point to save the airlines information in the database
app.post('/airlines',(req,res) => {
    const {name, country, number} = req.body;
    db.query('Insert into airline_info (airline_name, country, number_of_flights) values (?,?,?)',
    [name, country, number],
    (err, result) => {
        if(err){
            res.status(500).json({error : "Error creating airlines"})
        }
        else{
            res.status(201).json({message: "Airline created successfully" , id:result.insertId})
        }
    }
);
})

//end point to get all the airlines information from the database
app.get('/airlines' , (req,res) => {
    db.query('Select * from airline_info',(err,result) => {
        if(err){
            res.status(500).json({message : "error in retrieving airlines",err})
        }
        else{
            res.status(200).json(result)
        }
    })
})

//end point to get the airline information by id
app.get('/airlines/:id' , (req,res) => {
    db.query('Select * from airline_info where id = ?' ,[req.params.id], (err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else if(result.length ==0){
            res.status(404).json({message : "No airline found"})
        }
        else{
            res.status(200).json(result[0])
        }
    })
})

//end point to get the information about the flights related to airplane Id
app.get('/airlines/flights/:airlineId', async (req, res) => {
    const airlineId = req.params.airlineId;
    try {
        const response = await axios.get(`http://localhost:3032/flights/airline/${airlineId}`);
        res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json(console.log(error));
        }
    }
})

app.listen(PORT , () => {
    console.log(`Airlines listening to port ${PORT}`)
})