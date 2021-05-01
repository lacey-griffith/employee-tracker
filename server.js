const express = require('express');
const router = require('express').Router();

const inquirer = require('inquirer');
const { connect } = require('./db/connection');
const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes)

// TO DO routes
// [x] view all employees w/ First, Last, ID, Title, Salary, Department 
// [x] delete a role
// [x] delete a department
// [x] add a department (prompt name)
// [] add a role (prompt role.title, salary, role.dept)
// [] add an employee (prompt first, last, role.title, manager
// [x] update employee role
// BONUS **
// [] view employees by department
// [] view employees by manager
// [] view utilized budget of department (add salaries)

const startMenu = () => {
  inquirer.prompt({
    type: 'list',
    name: 'selectAction',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees','Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
  }).then(action => {
    action = action.selectAction
    if(action === 'View All Departments'){
      return viewDepartments();
    }
    if(action === 'View All Roles'){
      return viewRoles();
    }
    if(action === 'View All Employees'){
      console.log('User selected view all employees')
      return viewEmployees();
    }
    if(action === 'Add a Department'){
      console.log('User selected add a department')
    }
    if(action === 'Add A Role'){
      console.log('User selected add a role')
    }
    if(action === 'Add An Employee'){
      console.log('User selected add an employee')
    }
    if(action === 'Update An Employee Role'){
      console.log('User selected update an employee role')
    }
  })
}

//DEPT NAME and ID
const viewDepartments = () => {
  const sql = 'SELECT * FROM departments';
  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

//TITLE, ROLE.ID, DEPT OF ROLE, SALARY OF ROLE
const viewRoles = () => {
  const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';

  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

//ID, FIRST, LAST, TITLE, DEPT, SALARY
const viewEmployees= () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name
  FROM employees
  JOIN roles ON employees.role_id = roles.id
  JOIN departments ON roles.dept_id = departments.id ORDER BY dept_name`;

  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

//respond to requests not found
app.use((req, res) => {
  res.status(404).end();
})
//connect to server after connect to database
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startMenu();
  });
});