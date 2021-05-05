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
// [] delete a role
// [] delete a department
// [] delete an employee
// [x] add a department (prompt name)
// [] add a role (prompt role.title, salary, role.dept)
// [x] add an employee (prompt first, last, role.title, 
// [] add manager_id?? to add employee
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
        switch (action) {
          case 'View All Departments':
            viewDepartments();
            break;

          case 'View All Roles':
            viewRoles();
            break;

          case 'View All Employees':
            //once role_id is established for new employee, change the display back to JOIN statements
            viewEmployees();
            break;

          case 'Add A Department':
            addDept();
            break;

          case 'Add A Role':
            addRole();
            break;

          case 'Add An Employee':
            addEmployee();
            break;

          case 'Update An Employee Role':
            //need to get accurate employee.id, currently works but not correct id number 100% of time
            selectEmployee();
            //updateRole();
            break;

          case 'Delete A Department':
            selectDept();
            break;

          case 'Delete A Role':
            console.log('User selected to delete a role')
            startMenu();
            break;

          case 'Delete An Employee':
            console.log('User selected to delete an employee')
            startMenu();
            break;
        }
  })
}
// VIEW ALL OPTIONS
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
  
  const sql2 = `SELECT * FROM roles`;
  db.query(sql2, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}
const viewEmployees= () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.dept_name
  FROM employees
  JOIN roles ON employees.role_id = roles.id
  JOIN departments ON roles.dept_id = departments.id ORDER BY employees.id`;

  //change this back!!!!
  const sql2 = `SELECT * FROM employees`;
  db.query(sql2, (err, res) => {
    if (err) throw err
    console.table(res)
    startMenu();
  })
}

// ADD OPTIONS
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
startMenu();
};
//needs ability to select manager for employee being added
const addEmployee = () => {
  inquirer.prompt([{
      type: 'input',
      name: 'first_name',
      message: `Employee's first name:`
    }, {
      type: 'input',
      name: 'last_name',
      message: `Employee's last name:`
    },{
      type: 'list',
      name: 'title',
      message: 'Select employee role',
      choices: chooseRole()
    }])
    .then(newEmployee => {
      first_name = newEmployee.first_name
      last_name = newEmployee.last_name
      newEmployee.role_id = roleArr.indexOf(newEmployee.title) + 1;
      console.log(newEmployee)

      const sql = `INSERT INTO employees (first_name, last_name, role_id) 
      VALUES (?,?,?)`;
      const params = [first_name, last_name, newEmployee.role_id]

      db.query(sql, params, (err, result) => {
        if (err){
          console.log(err)
        }
        console.log(`New ${newEmployee.title}, ${first_name} ${last_name}, added successfully.`)
        return startMenu();
      })
    })
}

// UPDATE EMPLOYEE ROLE
let currentEmployee = {}
const selectEmployee = () => {
  employeeArr = []

  const sql = `SELECT * FROM employees`;
  db.query(sql, (err, res) => {
    if (err) throw err
    for (let i = 0; i < res.length; i++) {
      let employee = `${res[i].first_name} ${res[i].last_name}`
      employeeArr.push(employee)
    }
    inquirer.prompt({
      type: 'list',
      name: 'updateEmployee',
      message: 'Which employee would you like to update?',
      choices: employeeArr.map(employee => `${employee}`)

    }).then(employee => {
      let index = employee.updateEmployee.indexOf(" ")
      currentEmployee.first_name = employee.updateEmployee.substr(0, index)
      currentEmployee.last_name = employee.updateEmployee.substr(index + 1)

      const sql = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`;
      const params = [currentEmployee.first_name, currentEmployee.last_name]

      db.query(sql, params, (err, res) => {
        if(err) throw err;
        currentEmployee.id = res[0].id
        updateRole(currentEmployee)
      })
    })
  })
}


const chooseRole = () => {

}

const updateRole = (currentEmployee) => {
      roleArr = []
      const sql = `SELECT roles.title FROM roles`;

      db.query(sql, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
          role = `${res[i].title}`
          roleArr.push(role)
        }
        inquirer.prompt({
          type: 'list',
          name: 'updateRole',
          message: 'Select new role.',
          choices: roleArr.map(role => `${role}`)

        }).then(newRole => {
          currentEmployee.newRole = newRole.updateRole
          
          const sql = `SELECT id FROM roles WHERE roles.title = ?`
          const params = [currentEmployee.newRole]
          db.query(sql, params, (err, res) => {
            if(err) throw err;
            currentEmployee.newRole_id = res[0].id
          })
          inquirer.prompt({
            type: 'list',
            name: 'confirmUpdate',
            message: 'Are you sure you want to update the role of this employee?',
            choices: ['Confirm update.','Cancel, return to menu.']
          }).then(data => {
            //db.query()
            if(data.confirmUpdate === "Cancel, return to menu."){
              console.log('Update cancelled.')
              startMenu();
            }
            if(data.confirmUpdate === "Confirm update."){
              console.log(currentEmployee)
              const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
              const params = [currentEmployee.newRole_id, currentEmployee.id]
              db.query(sql, params, (err, res) => {
                console.log(`${currentEmployee.first_name} ${currentEmployee.last_name} successfully updated to ${currentEmployee.newRole}`)
                startMenu();
              })
            }
          })
          //currentEmployee.updatedRole_id = roleArr.indexOf(`${newRole.updateRole}`) + 1

          // const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
          // const params = [currentEmployee.updatedRole_id, currentEmployee.id]

          //   db.query(sql, params, (err, result) => {
          //     if(err) throw err
          //     console.log(`${currentEmployee.first_name} ${currentEmployee.last_name} successfully updated.`,)
          //     startMenu();
          //   })
        })
  })
}

let currentDept = {};
// DELETE OPTIONS
const selectDept = () => {
  let deptArr = [];
  const sql = `SELECT * FROM departments`;

  db.query(sql, (err, res) => {
    if(err){console.log(err)}
    for(let i = 0; i < res.length; i++) {
      dept = res[i].dept_name
      deptArr.push(dept)
    }
    inquirer.prompt({
    type: 'list',
    name: 'deleteDept',
    message: 'Which department would you like to delete?',
    choices: deptArr.map(dept => `${dept}`)
  })
  .then(chosenDept => {
    currentDept.dept_name = chosenDept.deleteDept

    const sql = `SELECT id FROM departments WHERE departments.dept_name = ?`;
    const params = [currentDept.dept_name];
    db.query(sql, params, (err, result) => {
      if(err) throw err;
      currentDept.id = result[0].id
      return deleteDept(currentDept)
    })
  })
})
}
deleteDept = (dept) => {
  console.log(dept, 'line288')

    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [dept.id];

    db.query(sql, params, (err, result) => {
      if(err) throw err
      console.log(`${dept.dept_name} department successfully deleted.`)
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