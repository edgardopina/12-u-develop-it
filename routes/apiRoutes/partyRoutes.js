const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// const inputCheck = require('../../utils/inputCheck'); // validation function if needed

// GET list of all parties - /api/parties api endpoint
router.get('/parties', (req, res) => {
   const sql = `SELECT * FROM parties`;
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

// GET a single party - /api/party/:id - api endpoint
router.get('/party/:id', (req, res) => {
   const sql = `SELECT * FROM parties WHERE id = ?`;
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

// Delete a party - needs to be tested from Insomnia
// res is response for router.delete
router.delete('/party/:id', (req, res) => {
   const sql = `DELETE FROM parties WHERE id = ?`;
   const params = [req.params.id];
   // result is reponse for db.query
   db.query(sql, params, (err, result) => {
      if (err) {
         // 400 status code - user request was not accepted; responds on res
         res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
         // if db.query's result did not affect any rows, then responds on res
         res.json({ message: 'Party not found' });
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

module.exports = router;
