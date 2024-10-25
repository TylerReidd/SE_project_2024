const { MongoClient } = require('mongodb');

// MongoDB connection string and database name
const uri = "mongodb+srv://tylerreid1988:LF1uvZFMm9XYmhQN@cluster0.im4vf.mongodb.net/"; // Replace with your MongoDB URI
const dbName = "SE-2024"; // Replace with your database name

// Function to connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri);
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

async function checkRole(username) {
  const db = await connectToMongo();
  try {
    const user = await db.collection('USERS').findOne({username});
    return user.role;
  } catch (error) {
    console.error('No Role: ', error);
    throw error;
  }
}

async function loadGrades(username) {
  try {
    const data = await db.collection('GRADES').findOne({ username});

    const tableBody = document.getElementById('grades_table').querySelector('tbody');
    
    // Clear any existing rows
    tableBody.innerHTML = '';
    
    // Populate table with new data
    data.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.classname}</td>
        <td>${item.grade}</td>
        <td>${item.professor}</td>
        
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading data:', error);
  }
}


module.exports = { checkUser, checkRole, loadGrades }; // Export the checkUser function for use in server.js
