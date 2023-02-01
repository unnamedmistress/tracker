DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

-- CREATE TABLE "department": Creates a table named "department".
-- "id" is an unsigned integer that will be automatically incremented and used as the primary key.
-- "name" is a string with a maximum length of 30 characters and must be unique and not null.
CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

-- CREATE TABLE "role": Creates a table named "role".
-- "id" is an unsigned integer that will be automatically incremented and used as the primary key.
-- "title" is a string with a maximum length of 30 characters and must be unique and not null.
-- "salary" is an unsigned decimal number and must not be null.
-- "department_id" is an unsigned integer and must not be null.
-- An index is created for "department_id".
-- A foreign key constraint is created to reference the "id" of the "department" table. 
-- If a record in the "department" table is deleted, the corresponding records in the "role" table will be deleted as well.
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

- CREATE TABLE "employee": Creates a table named "employee".
-- "id" is an unsigned integer that will be automatically incremented and used as the primary key.
-- "first_name" is a string with a maximum length of 30 characters and must not be null.
-- "last_name" is a string with a maximum length of 30 characters and must not be null.
-- "role_id" is an unsigned integer and must not be null.
-- An index is created for "role_id".
-- A foreign key constraint is created to reference the "id" of the "role" table. 
-- If a record in the "role" table is deleted, the corresponding records in the "employee" table will be deleted as well.
-- "manager_id" is an unsigned integer.
-- An index is created for "manager_id".
-- A foreign key constraint is created to reference the "id" of the "employee" table. 
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
use employees;
INSERT INTO department
    (name)
VALUES
    ('Operations'),
    ('Analystics'),
    ('Marketing'),
    ('Executive');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('General Manager', 11000000, 1),
    ('Coach', 4000000, 1),
    ('Team Lead Analyst', 15000000, 2),
    ('Team Analyst', 8000000, 2),
    ('Media Manager', 7000000, 3),
    ('Media Specialist', 3000000, 3),
    ('CEO', 45000000, 4),
    ('CEO Assistant', 25000000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Diane', 'Targarian', 1, NULL),
    ('Jon', 'Snow', 2, 1),
    ('Leo', 'Tawley', 3, NULL),
    ('Thief', 'Burger', 4, 3),
    ('Ronald', 'McDonald', 5, NULL),
    ('Ronald', 'Rodgers', 6, 5),
    ('Sookey', 'Johnson', 7, NULL),
    ('Waverly', 'Earp', 8, 7);
    