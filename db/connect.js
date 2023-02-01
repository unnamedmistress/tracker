// Importing the "express" module
const express = require('express');
// Importing the "mysql2" module for connecting to a MySQL database
const mysql = require('mysql2');
// Importing the "inquirer" module for creating command line prompts
const inquirer = require('inquirer');
// Importing the "console.table" module for formatting console output as tables
const consoleTable = require('console.table');

// Setting the port for the express app, with a fallback to port 3307
const PORT = process.env.PORT || 3307;
// Creating an instance of the express app
const app = express();

// Using the express.urlencoded middleware to parse incoming request bodies as URL-encoded data
app.use(express.urlencoded({ extended: false }));
// Using the express.json middleware to parse incoming request bodies as JSON data
app.use(express.json());

// Creating a connection to a MySQL database using the "mysql2" library
const connection = mysql.createConnection(
{
host: 'localhost',
user: 'root',
password: 'Psa5cr$$',
database: 'employees'
},
// Logging a message to the console indicating successful connection to the database
console.log(`Connected to the employee_db database.`)
);

// Adding a middleware that returns a 404 status code for any unhandled requests
app.use((req, res) => {
res.status(404).end();
});

// Listening for incoming HTTP requests on the specified port and logging a message to the console when the server is ready
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});

// Exporting the connection object for use in other modules
module.exports = connection;