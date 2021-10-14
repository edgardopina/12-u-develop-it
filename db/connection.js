const mysql = require('mysql2'); // connect to database - step 1

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

//***************** test connection ***************************
// app.get('/', (req, res) => {
// 	res.json({
// 		message: 'Hello World',
// 	});
// });

module.exports = db;