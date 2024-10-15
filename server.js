const express = require('express');
const bodyParser = require('body-parser');
const { checkUser } = require('./database-login');  // Import the checkUser function
const { MongoClient } = require('mongodb');

// Initialize the express app
const app = express();

// Middleware to parse form data (urlencoded for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string and database name
const uri = "mongodb+srv://USERNAME:PASSWORD@cluster0.im4vf.mongodb.net/";
const dbName = "SE-2024";

// Function to connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri, {  });
  await client.connect();
  return client.db(dbName);
}

// Serve the HTML login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Serve the login page (index.html)
});

// POST route to handle login form submission
app.post('/database-login.js', async (req, res) => {
  const { username, password } = req.body; // Get username and password from form submission
  const db = await connectToMongo(); // Connect to the MongoDB database
  
  try {
    // Query the users collection to check if the user exists
    const user = await db.collection('USERS').findOne({ username, password });

    // If user exists, login is successful
    if (user) {
      res.send('Login successful!');
    } else {
      // If user doesn't exist, send an error message
      res.send('Invalid username or password');
    }
  } catch (error) {
    // Handle any errors during database query
    res.status(500).send('Error connecting to the database');
  }
});

// Start the server and listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
