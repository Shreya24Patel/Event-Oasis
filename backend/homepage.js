const express = require('express');
const mysql = require('mysql');
const app = express();

// Set up the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'event_oasis'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for the homepage
app.get('/', (req, res) => {
  res.send(`
    <div class="container">
      <header
          class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div class="col-md-3 mb-2 mb-md-0">
              <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
                  <img src="./images/event oasis name.png" alt="event oasis" class="img-fluid tp">
              </a>
          </div>

          
          <ul class="nav col-12 col-md-auto mb-2 nav-pills justify-content-center mb-md-0">
              <li><a href="./index.html" class="nav-link px-2 ">Home</a></li>
              <li> <!-- List item for Services link -->
                  <a href="/services" class="nav-link px-2 link-secondary">Services</a> <!-- Services link -->
              </li>

              <li><a href="/about-us" class="nav-link px-2 ">About Us</a></li> <!-- About Us link -->
              <li><a href="/join-us" class="nav-link px-2 ">Join Us</a></li> <!-- Join Us link -->
              <li><a href="/wishlist" class="nav-link px-2 ">Wishlist</a></li> <!-- Wishlist link -->

          </ul>

          <div class="dropdown text-end col-md-2 ">
              <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="./images/image1.jpg" alt="mdo" width="32" height="32" class="rounded-circle">
              </a>
              <ul class="dropdown-menu text-small">

                  <li><a class="dropdown-item" href="#">Settings</a></li>
                  <li><a class="dropdown-item" href="#">Profile</a></li>
                  <li>
                      <hr class="dropdown-divider">
                  </li>
                  <li><a class="dropdown-item" href="#">Sign out</a></li>
              </ul>
          </div>
      </header>
  </div>
  `);
});

// Route for the Services page
app.get('/services', (req, res) => {
  res.send(`
    <h1>Services</h1>
    <p>Here is the list of services we offer.</p>
  `);
});

// Route for the About Us page
app.get('/about-us', (req, res) => {
  res.send(`
    <h1>About Us</h1>
    <p>Here is some information about our company.</p>
  `);
});

// Route for the Join Us pageapp.get('/join-us', (req, res) => {
  res.send(`
    <h1>Join Us</h1>
    <p>Here is the information on how to join our team.</p>
  `);


// Route for the Wishlist page
app.get('/wishlist', (req, res) => {
  res.send(`
    <h1>Wishlist</h1>
    <p>Here is your current wishlist.</p>
  `);
});

// Set up the server to listen for requests
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});