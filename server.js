//allow express
const express = require('express');
//connent to database
const mysql = require('mysql2');
//connect checkEmployeeInput function
const checkEmployeeInput = require('./utils/checkEmployeeInput')
//PORT designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();
//middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
//security
require('dotenv').config();
let pw = process.env.pw;
let database = process.env.database;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: `${pw}`,
    database: `${database}`
  },
  console.log(`Connected to the ${database} database.`)
);

//get all roles
app.get('/api/roles',(req, res) => {
  const sql = `SELECT roles.*, departments.dept_name FROM roles LEFT JOIN departments ON roles.dept_id = departments.id;`

  db.query(sql, (err,rows) => {
    if(err){
      res.status(500).json({error: err.message})
      return
    }
    res.json({
      message: 'sucess',
      data: rows
    })
  })
})

//get all departments
app.get('/api/departments', (req, res) => {
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, rows) => {
    if(err){
      res.status(500).json({error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
});

//need to update employees to join roles and departments to employees to display job title, dept and salary plus
//employee id, first name and last name
//get all employees
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM employees`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({
        error: err.message
      });
      return
    }
    res.json({
      message: 'success',
      data: rows
    })
  })
})

//get one employee
app.get('/api/employees/:id', (req, res) => {
  const sql = `SELECT * FROM employees WHERE id = ?`;
  const params = [req.params.id]

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({
        error: err.message
      })
      return;
    }
    res.json({
      message: 'success',
      data: row
    })
  })
});

// Delete an employee
app.delete('/api/employee/:id', (req, res) => {
  const sql = `DELETE FROM employees WHERE id =?`;
  const params = [req.params.id]
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({
        error: err.message
      })
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found.'
      })
    } else {
      res.json({
        message: 'Employee deleted successfully.',
        changes: result.affectedRows,
        id: req.params.id
      })
    }
  })
});

// Create an employee
app.post('/api/employee', ({
  body
}, res) => {
  const errors = checkEmployeeInput(body, 'first_name', 'last_name')

  if (errors) {
    res.status(400).json({
      error: errors
    })
    return;
  }
  const sql = `INSERT INTO employees (first_name, last_name) 
              VALUES (?,?)`;
  const params = [body.first_name, body.last_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({
        error: err.message
      })
    }
    res.json({
      message: 'Employee added successfully!',
      data: body
    })
  });
})

//respond to requests not found
app.use((req, res) => {
  res.status(404).end();
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})