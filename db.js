const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@Mohd1641MD@",
  database: "willsip",
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySql Connected Successfully.....");
  }
});

module.exports = db;
