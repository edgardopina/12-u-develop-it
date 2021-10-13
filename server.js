const mysql = require('mysql2'); // connect to database - step 1
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck'); // utility validation function

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

// GET list of all potential candidates - /api/candidates api endpoint
app.get('/api/candidates', (req, res) => {
   const sql = `SELECT 
                  candidates.*,
                  parties.name AS party_name
                  FROM candidates
                  LEFT JOIN parties
                  ON candidates.party_id = parties.id`;
   db.query(sql, (err, rows) => {
      if (err) {
         // 500 status code - server errors
         res.status(500).json({ error: err.message });
         return; // exits database call
      }
      res.json({
         message: 'success',
         data: rows,
      });
   });
});

// GET a single candidate - /api/candidate/:id - api endpoint
app.get('/api/candidate/:id', (req, res) => {
   const sql = `SELECT 
                  candidates.*,
                  parties.name AS party_name
                  FROM candidates
                  LEFT JOIN parties
                  ON candidates.party_id = parties.id
                  WHERE id = ?`;
   const params = [req.params.id];
   db.query(sql, params, (err, row) => {
      if (err) {
         // 400 status code - user request was not accepted
         res.status(400).json({ error: err.message });
         return; // exits database call
      }
      res.json({
         message: 'success',
         data: row,
      });
   });
});

// Delete a candidate - needs to be tested from Insomnia
// res is response for app.delete
app.delete('/api/candidate/:id', (req, res) => {
   const sql = `DELETE FROM candidates WHERE id = ?`;
   const params = [req.params.id];
   // result is reponse for db.query
   db.query(sql, params, (err, result) => {
      if (err) {
         // 400 status code - user request was not accepted; responds on res
         res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         // if db.query's result did not affect any rows, then responds on res
         res.json({ message: 'Candidate not found' });
      } else {
         // found and deleted row; responds on res with data from db.query on result
         res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id,
         });
      }
   });
});

// // Create a candidate; NOTE that we are NOT using id because of its AUTO_INCREMENT property
// app.post('/api/candidate', ({ body }, res) => {
app.post('/api/candidate', (req, res) => {
   // validates input from client
   // const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
   const errors = inputCheck(req.body, 'first_name', 'last_name', 'industry_connected');
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
               VALUES (?,?,?)`;
   // const params = [body.first_name, body.last_name, body.industry_connected];
   const params = [req.body.first_name, req.body.last_name, req.body.industry_connected];
   db.query(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: 'success',
         data: req.body,
      });
   });
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
