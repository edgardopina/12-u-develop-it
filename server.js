const mysql = require('mysql2'); // connect to database - step 1
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database - step 2
const db = mysql.createConnection(
   {
      host: 'localhost', // database host
      user: 'root', // MySQL username
      password: 'MyGoofyStrongPassword09()', // MySQL password
      database: 'election', // database name
   },
   console.log(`Connected to the 'election' database`)
);

// GET list of all potential candidates
// db.query(`SELECT * FROM candidates`, (err, rows) => {
// 	console.log(rows);
// });

// GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 111`, (err, row) => {
// 	if (err) {
// 		console.log(`~ err`, err);
// 	}
// 	console.log(row);
// });

// Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result);
// });

// Create a candidate; NOTE that we are NOT using id because of its AUTO_INCREMENT property
const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
					VALUES (?,?,?)`;
const params = ['Ronald', 'Firbank', 1];
db.query(sql, params, (err, result) => {
   if (err) {
      console.log(err);
   }
   console.log(result);
});

//***************** test connection ***************************
// app.get('/', (req, res) => {
// 	res.json({
// 		message: 'Hello World',
// 	});
// });

// Default response for any other request (Not Found). THIS IS A CATCHALL ROUTE AND IT
// MUST BE PLACED AS THE LAST ROUTE to prevent overriding all other GET routes
app.use((req, res) => {
   res.status(404).end();
});

// server listener
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
