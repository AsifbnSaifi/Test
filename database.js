const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    database: 'studentsmarks',
    password: '12345678'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection