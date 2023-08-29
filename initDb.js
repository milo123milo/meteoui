const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
  // Select the database



  // Create the database if it doesn't exist
  db.query('CREATE DATABASE IF NOT EXISTS meteo', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    db.query('USE meteo', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      } })

    // Create the table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS sensors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data TEXT,
        currentDateTime DATETIME
      )
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table created or already exists');
    });
  });
});

module.exports = db;
