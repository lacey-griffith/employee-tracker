 CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL
    -- role_id
    -- manager_id
    );

CREATE TABLE roles (
   id INT(10) NOT NULL,
   title VARCHAR(30) NOT NULL,
   salary DECIMAL(15,2)
   -- department_id
);

CREATE TABLE departments (
   id INT(10) NOT NULL,
   dept_name VARCHAR(30)
);
