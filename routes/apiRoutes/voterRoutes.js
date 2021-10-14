const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck'); // validation function if needed

// GET list of all voters - /api/voters api endpoint
router.get('/voters', (req, res) => {
   const sql = `SELECT * FROM voters ORDER BY last_name ASC`;
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

// GET a single voter - /api/voter/:id - api endpoint
router.get('/voter/:id', (req, res) => {
   const sql = `SELECT * FROM voters WHERE id = ?`;
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

// Delete a voter - needs to be tested from Insomnia
// res is response for router.delete
router.delete('/voter/:id', (req, res) => {
   const sql = `DELETE FROM voters WHERE id = ?`;
   // const params = [req.params.id];
   // result is reponse for db.query
   // db.query(sql, params, (err, result) => {
   db.query(sql, req.params.id, (err, result) => {
      if (err) {
         // 400 status code - user request was not accepted; responds on res
         res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         // if db.query's result did not affect any rows, then responds on res
         res.json({ message: 'Voter not found' });
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


// // Create a voter; NOTE that we are NOT using id because of its AUTO_INCREMENT property
// router.post('/voter', ({ body }, res) => {
router.post('/voter', (req, res) => {
   // validates input from client
   // const errors = inputCheck(body, 'first_name', 'last_name', 'email');
   const errors = inputCheck(req.body, 'first_name', 'last_name', 'email');
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `INSERT INTO voters (first_name, last_name, email)
               VALUES (?,?,?)`;
   // const params = [body.first_name, body.last_name, body.industry_connected];
   const params = [req.body.first_name, req.body.last_name, req.body.email];
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

// PUT (update) a single voter - /api/voter/:id - api endpoint
router.put('/voter/:id', (req, res) => {
   const errors = inputCheck(req.body, 'email');
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `UPDATE voters SET email = ? WHERE id = ?`;
   const params = [req.body.email, req.params.id];

   // result is reponse for db.query
   db.query(sql, params, (err, result) => {
      if (err) {
         // 400 status code - user request was not accepted; responds on res
         res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         // if db.query's result did not affect any rows, then responds on res
         res.json({ message: 'Voter not found' });
      } else {
         // found and updated row; responds on res with data from db.query on result
         res.json({
            message: 'success',
            changes: result.affectedRows,
            id: req.params.id,
         });
      }
   });
});


module.exports = router;
