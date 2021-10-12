const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
