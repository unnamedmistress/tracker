SELECT role.id, role.title, role.salary FROM role ORDER BY role.id;
SELECT role.id, role.title FROM role ORDER BY role.id;
SELECT * FROM employee;

SELECT department.id, department.name FROM department ORDER BY department.id;

SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;
    
SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY manager;
  
SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee
  LEFT JOIN employee manager on manager.id = employee.manager_id
  INNER JOIN role ON (role.id = employee.role_id)
  INNER JOIN department ON (department.id = role.department_id)
  ORDER BY employee.id;
  
SELECT first_name, last_name, role_id FROM employee 	WHERE employee.id = 4;
-- LEFT JOIN clause:
-- Joins the "employee" table with the "manager" table on the "manager.id" = "employee.manager_id" condition.
-- The "LEFT JOIN" keyword ensures that all records from the "employee" table will be included in the result set,
-- even if there are no matching records in the "manager" table.

-- INNER JOIN clauses:
-- Joins the "role" table and "department" table with the "employee" table based on the conditions:
-- "role.id" = "employee.role_id" and "department.id" = "role.department_id".
-- The "INNER JOIN" keyword returns only those records that match in both joined tables.

-- ORDER BY clause:
-- Orders the result set by the "id" column of the "employee" table.

-- SELECT statement:
-- Selects the "first_name", "last_name", and "role_id" columns from the "employee" table.
-- The "WHERE" clause returns only those rows where the "employee.id" is equal to 4.