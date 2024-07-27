const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { dbConn } = require("../db/dbConnect");
dotenv.config();

const secretKey = process.env.SECRET;

async function createUser(user) {
  const { userName, userType, userEmail, userPassword } = user;
  const isUserExist = await checkUserExist(userEmail);
  if (isUserExist) {
    throw new Error(`user already exist with email = ${userEmail}`);
  }
  const SQL = `INSERT INTO user(email,type,name,password) values(?,?,?,?)`;
  dbConn.query(
    SQL,
    [userEmail, userType, userName, userPassword],
    (err, res) => {
      if (err) {
        console.error(err);
        throw new Error(`error inserting user with email = ${userEmail}`);
      }
      const LOGIN_SQL = `INSERT INTO login(email,is_loggedin) values(?,?)`;
      dbConn.query(LOGIN_SQL, [userEmail, false], (err, res) => {
        if (err) {
          console.error(err);
          throw new Error(
            `Error inserting value in login with email = ${userEmail}`
          );
        }
      });
    }
  );
}
async function checkUserExist(userEmail) {
  return new Promise((res, rej) => {
    const SQL = "select *from login where email=?";
    dbConn.query(SQL, [userEmail], (err, rows) => {
      if (err) {
        console.error(err);
        rej("something went wrong");
      }
      if (rows.length === 1) res(true);
      else res(false);
    });
  });
}
async function checkUserCredentials(email, password) {
  return new Promise((res, rej) => {
    const SQL = `SELECT password FROM user WHERE email = ?`;
    dbConn.query(SQL, [email], (err, rows) => {
      if (err) {
        rej("SELECT error from user table");
      }
      if (rows[0]["password"] === password) res();
      else rej(`invalid credentials for user ${email}`);
    });
  });
}
async function login(email, password) {
  const isUserExist = await checkUserExist(email);
  if (!isUserExist) throw new Error(`user doesn't exist with email = ${email}`);
  await checkUserCredentials(email, password);
  const SQL = `UPDATE login set is_loggedin = ? where email = ?`;
  dbConn.query(SQL, [true, email], (err, rows) => {
    if (err) {
      console.log(err);
    }
  });
  const getUserQuery = `SELECT email,name,type FROM user WHERE email = ?`;
  const res = await dbConn.promise().query(getUserQuery, [email]);
  return res[0][0];
}
async function saveToken(email, token) {
  const query = `UPDATE login SET token = ? where email = ?`;
  dbConn.promise().query(query, [token, email]);
}
function getAuthToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: "1h" });
}
function verifyToken(token) {
  return new Promise((res, rej) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) rej("Invalid Token");
      res(user);
    });
  });
}
async function logout(user) {
  const query = `UPDATE login SET token = NULL  where email = ?`;
  await dbConn.promise().query(query, [user.email]);
}
async function checkLogin(user) {
  const query = `SELECT token FROM login WHERE email = ?`;
  const res = await dbConn.promise().query(query, [user.email]);
  return { isLoggedIn: res[0][0].token !== null };
}
module.exports = {
  createUser,
  login,
  getAuthToken,
  verifyToken,
  saveToken,
  logout,
  checkLogin,
};
