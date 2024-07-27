const express = require("express");
const cors = require("cors");
const multer = require('multer');
const app = express();
const { connect } = require("./src/db/dbConnect");
const {
  createUser,
  login,
  getAuthToken,
  verifyToken,
  saveToken,
  logout,
  checkLogin,
} = require("./src/auth/Auth");
const dotenv = require("dotenv");
const { createService } = require("./src/service/services");

dotenv.config();

app.use(cors());

app.use(express.json());

const PORT = process.env.SERVER_PORT;

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Route to handle file upload
app.post('/upload', upload.array('file',10), (req, res) => {
    console.log('File uploaded:', req.fileData);
    res.sendStatus(200);
});

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.post("/user", async (req, res) => {
  console.log(req.body);
  try {
    await createUser(req.body);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message ? err.message : err });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    const token = getAuthToken(user);
    saveToken(email, token);
    res.status(200).json({ message: "success", token });
  } catch (err) {
    res.status(500).json({ message: err.message ? err.message : err });
  }
});

app.get("/is-loggedin", authenticateToken, async (req, res, next) => {
  const { isLoggedIn } = await checkLogin(req.user);
  res.json({ isLoggedIn });
});
app.post("/signout", authenticateToken, (req, res, next) => {
  logout(req.user);
  res.json({ success: true });
});

app.post("/services", authenticateToken, async (req, res, next) => {
  const { service } = req.body;
  const user = req.user;
  // console.log(service,user,req.body);
  const { serviceId } = await createService(service, user);
  console.log(serviceId);
  res.json({ serviceId });
});

app.listen(PORT, async () => {
  console.log(`listening on ${PORT}`);
  try {
    const res = await connect();
    console.log(res);
  } catch (err) {
    console.error("error ", err);
  }
});

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "Token not found" });
  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
}
