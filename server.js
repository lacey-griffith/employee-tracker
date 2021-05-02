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
    choices: ['View All Departments', 'View All Roles', 'View All Employees','Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Delete A Department', 'Delete A Role', 'Delete An Employee']
  }).then(action => {
    action = action.selectAction
    if(action === 'View All Departments'){
      return viewDepartments();
    }
    if(action === 'View All Roles'){
      return viewRoles();
    }
    if(action === 'View All Employees'){
      return viewEmployees();
    }
    if(action === 'Add A Department'){
      return addDept();
    }
    if(action === 'Add A Role'){
      return addRole();
    }
    if(action === 'Add An Employee'){
      return addEmployee();
    }
    if(action === 'Update An Employee Role'){
      return updateRole();
    }
    if(action === 'Delete A Department'){
      console.log('User selected to delete a department')
    }
    if(action === 'Delete A Role'){
      console.log('User selected to delete a role')
    }
    if(action === 'Delete An Employee'){
      console.log('User selected to delete an employee')
    }
  })
}

const viewDepartments = () => {
  const sql = 'SELECT * FROM departments';
  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

const viewRoles = () => {
  const sql = 'SELECT roles.title, roles.id, roles.salary, departments.dept_name FROM roles JOIN departments ON roles.dept_id = departments.id';

  db.query(sql, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

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

const addDept = () => {
  inquirer.prompt({
      type: 'input',
      name: 'dept_name',
      message: 'What is the name of the new department?'
    })
    .then(newDept => {
      newDept = newDept.dept_name
      const sql = `INSERT INTO departments (dept_name) VALUES (?)`;
      const params = newDept
      db.query(sql, params, (err, result) => {
        if (err) throw err
        //console.table(result)
        console.log(`The ${newDept} department was added successfully.`)
        startMenu();
      })
    })
}

const addRole = () => {
console.log('Feature under construction.')
};

const addEmployee = () => {
  inquirer.prompt([{
      type: 'input',
      name: 'first_name',
      message: `Employee's first name:`
    }, {
      type: 'input',
      name: 'last_name',
      message: `Employee's last name:`
    }])
    .then(newEmployee => {
      first_name = newEmployee.first_name
      last_name = newEmployee.last_name

      const sql = `INSERT INTO employees (first_name, last_name) VALUES (?,?)`;
      const params = [first_name, last_name]

      db.query(sql, params, (err, result) => {
        if (err) throw err
        //console.log(result)
        console.log(`New employee, ${first_name} ${last_name}, added successfully.`)
        startMenu();
      })
    })
}

const updateRole = () => {
  employeeArr = []
  employee = {}
  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, res) => {
    for (let i = 0; i < res.length; i++) {
      employee = [`${res[i].first_name} ${res[i].last_name}`]
      employeeArr.push(employee)
    }

    inquirer.prompt({
      type: 'list',
      name: 'updateEmployee',
      message: 'Which employee would you like to update?',
      choices: employeeArr.map(employee => `${employee}`)

    }).then(employee => {
      let index = employee.updateEmployee.indexOf(" ")
      let first_name = employee.updateEmployee.substr(0, index)
      let last_name = employee.updateEmployee.substr(index + 1)
      //start
      //end
      roleArr = []
      const sql2 = `SELECT * FROM roles`;

      db.query(sql2, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
          role = `${res[i].title}`
          roleArr.push(role)
        }
        inquirer.prompt({
          type: 'list',
          name: 'newRole',
          message: 'Select new role.',
          choices: roleArr.map(role => `${role}`)

        }).then(newRole => {
          console.log(newRole)
          //start
          const sql = `SELECT * FROM employees WHERE first_name = ? AND last_name = ?`;
          const params = [first_name, last_name]
          db.query(sql, params, (err, res) => {
            if (err) throw err
            employee.currentRole_id = res[0].role_id
            console.log(employee, 'line 184')
          })
          //end
        })
        console.log(employee, 'moving around')

        //const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
        // const params = [req.body.role_id, req.params.id];

        // db.query(sql, params, (err, result) => {
        //     if(err){

        //returns employee object from database
        //find current role_id
        //list new role options
        //update employee's old role_id with new role_id
        //return that employee's role has been changes to *new role title*
      })
      console.log(employee, 'moving around')
    })
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