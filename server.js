//allow express
const express = require('express');
//PORT designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//connent to database
const mysql = require('mysql2');
//security
require('dotenv').config();
let pw = process.env.pw;
let database = process.env.database;

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: `${pw}`,
      database: `${database}`
    },
    console.log(`Connected to the ${database} database.`)
  );



app.get('/', (req, res) => {
    res.json({
        message: 'Oh hello, world.'
    })
})
//respond to requests not found
app.use((req, res) => {
    res.status(404).end();
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})