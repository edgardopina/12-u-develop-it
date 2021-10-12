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

db.query(`SELECT * FROM candidates`, (err, rows) => {
	console.log(rows);
});

// test connection
app.get('/', (req, res) => {
	res.json({
		message: 'Hello World',
	});
});

// Default response for any other request (Not Found). THIS IS A CATCHALL ROUTE AND IT
// MUST BE PLACED AS THE LAST ROUTE to prevent overriding all other GET routes
app.use((req, res) => {
	res.status(404).end();
});

// server listener
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
