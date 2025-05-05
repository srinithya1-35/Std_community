const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
host: "localhost",
user: "root",         // Change if your MySQL user is different
password: "WJ28@krhps",         // Add your MySQL password here if required
database: "college_portal"
});

// Connect to the database
db.connect((err) => {
if (err) {
console.error("Database Connection Failed!", err.message);
return;
}
console.log("Database Connected!");
});

module.exports = db;
