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


//get all employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM employees`;

  db.query(sql, (err, rows) => {
    if(err){
      res.status(500).json({error: err.message});
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

//get single employee 1 is hardcoded
// db.query(`SELECT * FROM employees WHERE id = 2`, (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(row);
// });

// Delete an employee
// db.query(`DELETE FROM employees WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// })

// Create an employee
// const sql = `INSERT INTO employees (id, first_name, last_name) 
//               VALUES (?,?,?)`;
// const params = [1, 'Vicki', 'Trevors'];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

//respond to requests not found
app.use((req, res) => {
    res.status(404).end();
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})