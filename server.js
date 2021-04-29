const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

//middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes)

// TO DO
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
  });
});