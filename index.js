// server.js
const express = require('express');
const app = express();
const port = 3300;

// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call the next middleware/route handler
});

// Define a route to render the EJS template
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on portt ${port}`);
});
