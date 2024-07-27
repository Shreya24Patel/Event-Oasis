const mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

con.connect((err) => {
  if (err) throw err;
  console.log("connected!! ");
  con.query("CREATE DATABASE IF NOT EXISTS event_oasis", (err, res) => {
    if (err) throw err;
    console.log("database created !!");
    con.changeUser({ database: "event_oasis" }, (err) => {
      if (err) throw err;
      createTables();
    });
  });
});
async function createTables() {
  const promises = [];

  const userTableQuery = `CREATE TABLE IF NOT EXISTS user (
        email VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(50),
        password VARCHAR(255)
    )`;
  await con.promise().query(userTableQuery);

  const loginTableQuery = `CREATE TABLE IF NOT EXISTS login (email VARCHAR(255) PRIMARY KEY,
    last_login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token VARCHAR(255),
    is_loggedin BOOLEAN,
    FOREIGN KEY (email) REFERENCES user(email)
    )`;

  await con.promise().query(loginTableQuery);

  const serviceType = `CREATE TABLE IF NOT EXISTS service_types(id INT PRIMARY KEY,
    name VARCHAR(255) UNIQUE
  ) `;
  await con.promise().query(serviceType);
  const insertServiceType = `INSERT IGNORE INTO service_types (id,name)
    VALUES (1,'venue'),(2,'caterers'),(3,'decorators')
  `;
  await con.promise().query(insertServiceType);

  const services = `CREATE TABLE IF NOT EXISTS services(id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255), 
    location VARCHAR(255),
    capacity INT ,
    description TEXT,
    userId VARCHAR(255),
    FOREIGN KEY (type) REFERENCES service_types(name),
    FOREIGN KEY (userId) REFERENCES user(email),
    CONSTRAINT chk_capacity CHECK (capacity > 0)
  )`;
  await con.promise().query(services);

  console.log("all tables created !!");
  con.end();
}
