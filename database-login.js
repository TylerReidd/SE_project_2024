const { MongoClient } = require('mongodb');

// MongoDB connection string and database name
const uri = "mongodb+srv://chris:superduperpassword222@cluster0.im4vf.mongodb.net/"; // Replace with your MongoDB URI
const dbName = "SE-2024"; // Replace with your database name

// Function to connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect(); // Connect to the database
  return client.db(dbName); // Return the database instance
}

// Function to check if the user exists in the database
async function checkUser(username, password) {
  const db = await connectToMongo(); // Connect to the database

  try {
    // Query the users collection to find a matching username and password
    const user = await db.collection('USERS').findOne({ username, password });
    return !!user; // Return true if the user exists, false otherwise
  } catch (error) {
    console.error('Error checking user:', error); // Log any errors
    throw error; // Propagate the error
  }
}

module.exports = { checkUser }; // Export the checkUser function for use in server.js
