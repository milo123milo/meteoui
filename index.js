// server.js
const express = require('express');
const app = express();
const port = 3300;

const db = require('./initDb');



// Set the view engine to EJS
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call the next middleware/route handler
});

app.use(express.static('public'));

function averageArrays(dataArray, maxPoints) {
  const tValues = [];
  const hValues = [];

  // Parse T and H values into separate arrays
  dataArray.forEach(item => {
    const tAndHString = item.data.slice(1, -1); // Remove the surrounding double quotes
    const [tString, hString] = tAndHString.split(':');
    const t = parseFloat(tString.split(',')[1]);
    const h = parseFloat(hString.split(',')[1]);
    tValues.push(t);
    hValues.push(h);
  });

  // Calculate the step size for averaging
  const step = Math.max(1, Math.ceil(tValues.length / maxPoints));

  // Average arrays with the specified step size
  const averagedTValues = [];
  const averagedHValues = [];

  for (let i = 0; i < tValues.length; i += step) {
    const tSlice = tValues.slice(i, i + step);
    const hSlice = hValues.slice(i, i + step);
    const tAverage = tSlice.reduce((sum, val) => sum + val, 0) / tSlice.length;
    const hAverage = hSlice.reduce((sum, val) => sum + val, 0) / hSlice.length;
    averagedTValues.push(tAverage);
    averagedHValues.push(hAverage);
  }

  return { averagedTValues, averagedHValues };
}

// Define a route to render the EJS template
app.get('/', (req, res) => {
  const data = req.query.data; 
  if (data === undefined) {
    res.render('index');
    return;
  }


// Parse data and insert into the database
const [tempData, humidityData] = data.split(':');
const tempValues = tempData.split(',').slice(1);
const humidityValues = humidityData.split(',').slice(1);

// Format the current date and time
const currentDateTime = new Date().toISOString().replace('T', ' ').replace('Z', '');

const insertQuery = `INSERT INTO sensors (data, currentDateTime) VALUES (?, ?)`;
const fullData = `${tempData}:${humidityData}`;
db.query(insertQuery, [fullData, currentDateTime], (err, result) => {
  if (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error inserting data');
    
  } else {
  console.log('Data inserted successfully');
  res.send('Data inserted successfully'); }
});
});

app.get('/values', (req, res) => {
  const type = req.query.type;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  
  let selectQuery = '';

  // Construct the appropriate SELECT query based on the type and date range
  if (type === 'last') {
    selectQuery = `SELECT * FROM sensors ORDER BY currentDateTime DESC LIMIT 1`;
  } else if (type === 'today') {
    selectQuery = `SELECT * FROM sensors WHERE DATE(currentDateTime) = '${new Date().toISOString().split('T')[0]}'`;
  } else if (type === 'month') {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    selectQuery = `SELECT * FROM sensors WHERE DATE(currentDateTime) BETWEEN '${firstDayOfMonth.toISOString().split('T')[0]}' AND '${lastDayOfMonth.toISOString().split('T')[0]}'`;
  } else if (type === 'custom') {
    selectQuery = `SELECT * FROM sensors WHERE DATE(currentDateTime) BETWEEN '${startDate}' AND '${endDate}'`;
  } else {
    // Default case, retrieve all data
    selectQuery = `SELECT * FROM sensors`;
  }

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).send('Error retrieving data');
    } else {
      if(type === 'custom' ){
        var ress = averageArrays(results, 10)
      res.json(ress);
      }else {
        res.json(results)
      }
      
    }
  });
});







// Start the server
app.listen(port, () => {
  console.log(`Server is running on portt ${port}`);
});
