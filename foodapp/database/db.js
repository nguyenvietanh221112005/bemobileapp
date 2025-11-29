const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "foodapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Test connection
db.getConnection()
  .then(connection => {
    console.log("Đã kết nối cơ sở dữ liệu!");
    connection.release();
  })
  .catch(err => {
    console.error("Không thể kết nối cơ sở dữ liệu:", err);
  });

module.exports = db;