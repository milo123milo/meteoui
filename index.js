// server.js
const express = require('express');
const app = express();
const port = 3300;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a route to render the EJS template
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on portt ${port}`);
});
