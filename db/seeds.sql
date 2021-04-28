INSERT INTO employees (first_name, last_name, role_id)
VALUES
('Vicki','Trevors', 01),
('John','Miller', 01),
('Jasmine','Swillman', 02),
('Ronald', 'Firbank', 04),
('Virginia', 'Woolf', 02),
('Piers', 'Gaveston', 02),
('Charles', 'LeRoi', 03),
('Katherine', 'Mansfield' 03),
('Dora', 'Carrington' 03),
('Edward', 'Bellamy' 03),
('Montague', 'Summers' 03),
('Octavia', 'Butler', 01),
('Riley','Brookes', 04),
('Unica', 'Zurn', 01);

INSERT INTO roles (id,title,salary)
VALUES
(001,'Director', 60000),
(002,'Manager', 50000),
(003,'Assistant Manager', 40000),
(004,'Cashier', 20000);

INSERT INTO departments (id,dept_name)
VALUES
(01,'Pharmacy'),
(02,'Grocery'),
(03,'Beauty'),
(04,'Outdoor');