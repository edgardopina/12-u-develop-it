const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET list of all potential candidates - /api/candidates api endpoint
router.get('/candidates', (req, res) => {
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
router.get('/candidate/:id', (req, res) => {
   const sql = `SELECT 
                  candidates.*,
                  parties.name AS party_name
                  FROM candidates
                  LEFT JOIN parties
                  ON candidates.party_id = parties.id
                  WHERE candidates.id = ?`;
   const params = [req.params.id];
   db.query(sql, params, (err, row) => {
      console.log(`~ sql, params`, sql, params)
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
// res is response for router.delete
router.delete('/candidate/:id', (req, res) => {
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
// router.post('/candidate', ({ body }, res) => {
router.post('/candidate', (req, res) => {
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

// PUT (update) a single candidate - /api/candidate/:id - api endpoint
router.put('/candidate/:id', (req, res) => {
   const errors = inputCheck(req.body, 'party_id');
   if (errors) {
      res.status(400).json({ error: errors });
      return;
   }
   const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;
   const params = [req.body.party_id, req.params.id];

   // result is reponse for db.query
   db.query(sql, params, (err, result) => {
      if (err) {
         // 400 status code - user request was not accepted; responds on res
         res.status(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         // if db.query's result did not affect any rows, then responds on res
         res.json({ message: 'Candidate not found' });
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
