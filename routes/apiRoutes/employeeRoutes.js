const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const checkInput = require('../../utils/checkInput');

//need to update to 
//display employee id, first, last + role.title, role.salary and departments.dept_name, *dept.manager
//get all employees
router.get('/employees', (req, res) => {
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
router.get('/employees/:id', (req, res) => {
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

// delete an employee
router.delete('/employee/:id', (req, res) => {
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

// create an employee
router.post('/employee', ({body}, res) => {
const errors = checkInput(body, 'first_name', 'last_name')

if (errors) {
    res.status(400).json({error: errors})
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

// update employee's role
router.put('/employee/:id', (req, res) => {
const errors = checkInput(req.body, 'role_id');

if (errors) {
res.status(400).json({ error: errors });
return;
}
const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
const params = [req.body.role_id, req.params.id];

db.query(sql, params, (err, result) => {
    if(err){
    res.status(400).json({message: err.message});
    return
    }
    else if(!result.affectedRows){
    res.json({message: 'Employee not found.'})
    }
    else {
    res.json({
        message: 'Employee role successfully updated!',
        data: req.body,
        changes: result.affectedRows
    })
    }
})
})

module.exports = router;  