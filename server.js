const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const db = require('./db/connection'); // MySQL database connection
const apiRoutes = require('./routes/apiRoutes');


// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', apiRoutes); // by adding '/api' here, we can remove it from the individual route expression in apiRoutes
// Default response for any other request (Not Found). THIS IS A CATCHALL ROUTE AND IT
// MUST BE PLACED AS THE LAST ROUTE to prevent overriding all other GET routes
app.use((req, res) => {
   res.status(404).end();
});


// start server after Database connection
db.connect(err => {
   if (err) throw err;
   console.log(`Database connected`);
   // server listener
   app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
   });
});
