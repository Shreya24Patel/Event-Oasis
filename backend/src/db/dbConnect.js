const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const dbConn = mysql.createConnection({
    host:"localhost",
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD
});

function connect() {
    return new Promise((res,rej) => {
        dbConn.connect((err) => {
            if(err) rej(err);
            res("Connected successfully to db ...");
        })
    })
}


module.exports = { connect, dbConn };