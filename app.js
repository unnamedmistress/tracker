const connection = require("./db/connect");
// Importing the connection module from the file
const inquirer = require('inquirer');
//prompting the user for input 
const promptMsg = {
  viewAllEmployees: "View All Employees who are working in the company",
  viewByDepartment: "View All Employees By Department they work in",
  viewByManager: "View All Employees By Manager they work under",
  addEmployee: "Add An Employee to this repository",
  removeEmployee: "Remove An Employee - This will remove the employee from the database",
  updateRole: "Update Employee Role - This will update the employee's role in the database",
  updateEmployeeManager: "Update Employee Manager",
  viewAllRoles: "View All Roles",
  exit: "Exit",
};
//This function is used to display a list of prompts, user can select from them and can trigger desired actions.
function prompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do next?",
      choices: [
       promptMsg.viewAllEmployees,
       promptMsg.viewByDepartment,
       promptMsg.viewByManager,
       promptMsg.viewAllRoles,
       promptMsg.addEmployee,
       promptMsg.removeEmployee,
       promptMsg.updateRole,
       promptMsg.exit,
      ],
    })
    .then((answer) => {
      console.log("answer", answer);
      switch (answer.action) {
        case promptMsg.viewAllEmployees:
          viewAllEmployees();
          break;

        case promptMsg.viewByDepartment:
          viewByDepartment();
          break;

        case promptMsg.viewByManager:
          viewByManager();
          break;

        case promptMsg.addEmployee:
          addEmployee();
          break;

        case promptMsg.removeEmployee:
          remove("delete");
          break;

        case promptMsg.updateRole:
          remove("role");
          break;

        case promptMsg.viewAllRoles:
          viewAllRoles();
          break;

        case promptMsg.exit:
          connection.end();
          break;
      }
    });
}
//This is a function named "viewAllEmployees" which is used to view all employees from a database.
function viewAllEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW ALL EMPLOYEES");
    console.log("\n");
    console.table(res);
    prompt();
  });
}
// Function that retrieves and displays employees based on department
function viewByDepartment() {
  const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW EMPLOYEE BY DEPARTMENT");
    console.log("\n");
    console.table(res);
    prompt();
  });
}
// Using the query method of the connection object to execute the SQL query
function viewByManager() {
  const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW EMPLOYEE BY MANAGER");
    console.log("\n");
    console.table(res);
    prompt();
  });
}
//a function to view all roles
function viewAllRoles() {
  const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW EMPLOYEE BY ROLE");
    console.log("\n");
    console.table(res);
    prompt();
  });
}
//a function to add an employee
async function addEmployee() {
  const addname = await inquirer.prompt(askName());

  //prompt the user for first and last name
  connection.query(
    "SELECT role.id, role.title FROM role ORDER BY role.id;",
    async (err, res) => {
      if (err) throw err;
      const { role } = await inquirer.prompt([
        {
          name: "role",
          type: "list",
          choices: () => res.map((res) => res.title),
          message: "What is the employee role?: ",
        },
      ]);
      let roleId;
      for (const row of res) {
        if (row.title === role) {
          roleId = row.id;
          continue;
        }
      }
      connection.query("SELECT * FROM employee", async (err, res) => {
        if (err) throw err;
        let choices = res.map((res) => `${res.first_name} ${res.last_name}`);
        choices.push("none");
        let { manager } = await inquirer.prompt([
          {
            name: "manager",
            type: "list",
            choices: choices,
            message: "Choose the employee Manager: ",
          },
        ]);
        let managerId;
        let managerName;
        if (manager === "none") {
          managerId = null;
        } else {
          for (const data of res) {
            data.fullName = `${data.first_name} ${data.last_name}`;
            if (data.fullName === manager) {
              managerId = data.id;
              managerName = data.fullName;
              console.log(managerId);
              console.log(managerName);
              continue;
            }
          }
        }
        console.log(
          "Employee has been added. Please view all employee to verify this..."
        );
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: addname.first,
            last_name: addname.last,
            role_id: roleId,
            manager_id: parseInt(managerId),
          },
          (err, res) => {
            if (err) throw err;
            prompt();
          }
        );
      });
    }
  );
}
function remove(input) {
  const promptQ = {
    yes: "yes",
    no: "no I don't (view all employees on the main option)",
  };
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        message:
          "In order to proceed an employee, an ID must be entered. View all employees to get" +
          " the employee ID. Do you know the employee ID?",
        choices: [promptQ.yes, promptQ.no],
      },
    ])
    .then((answer) => {
      if (input === "delete" && answer.action === "yes") removeEmployee();
      else if (input === "role" && answer.action === "yes") updateRole();
      else viewAllEmployees();
    });
}

async function removeEmployee() {
  const answer = await inquirer.prompt([
    {
      name: "first",
      type: "input",
      message: "Enter the employee ID you want to remove:  ",
    },
  ]);

  connection.query(
    "DELETE FROM employee WHERE ?",
    {
      id: answer.first,
    },
    function (err) {
      if (err) throw err;
    }
  );
  console.log("Success Employee has been removed on the system!");
  prompt();
}

function askId() {
  return [
    {
      name: "name",
      type: "input",
      message: "What is the employe ID?:  ",
    },
  ];
}

async function updateRole() {
  const employeeId = await inquirer.prompt(askId());

  connection.query(
    "SELECT role.id, role.title FROM role ORDER BY role.id;",
    async (err, res) => {
      if (err) throw err;
      const { role } = await inquirer.prompt([
        {
          name: "role",
          type: "list",
          choices: () => res.map((res) => res.title),
          message: "What is the new employee role?: ",
        },
      ]);
      let roleId;
      for (const row of res) {
        if (row.title === role) {
          roleId = row.id;
          continue;
        }
      }
      connection.query(
        `UPDATE employee 
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`,
        async (err, res) => {
          if (err) throw err;
          console.log("Role has been updated..");
          prompt();
        }
      );
    }
  );
}
//a function to add a worker a department
function askName() {
  return [
    {
      name: "first",
      type: "input",
      message: "Enter the first name: ",
    },
    {
      name: "last",
      type: "input",
      message: "Enter the last name: ",
    },
  ];
}
prompt();


