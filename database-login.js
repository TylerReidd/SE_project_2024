const { MongoClient } = require("mongodb");

// MongoDB connection string and database name
const uri =
  "mongodb+srv://tylerreid1988:LF1uvZFMm9XYmhQN@cluster0.im4vf.mongodb.net/"; // Replace with your MongoDB URI
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
    const user = await db.collection("USERS").findOne({ username });
    if (user.username == username && user.password == password) {
      return true;
    } else {
      return false;
    }
    // Return true if the user exists, false otherwise
  } catch (error) {
    console.error("Error checking user:", error); // Log any errors
    throw error; // Propagate the error
  }
}

async function checkRole(username) {
  const db = await connectToMongo();
  try {
    const user = await db.collection("USERS").findOne({ username });

    return user.role;
  } catch (error) {
    console.error("No Role: ", error);
    throw error;
  }
}

//

async function setGrade(username, grade) {
  const db = await connectToMongo(); // Ensure db is connected
  try {
    await db
      .collection("GRADES")
      .updateOne({ name: username }, { $set: { grade: grade } }); // Fetch all grades for the user
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; // Propagate the error
  }
}

async function loadGrades(username) {
  const db = await connectToMongo(); // Ensure db is connected
  try {
    const data = await db.collection("GRADES").find({ username }).toArray(); // Fetch all grades for the user
    return data; // Return the data instead of manipulating the DOM
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; // Propagate the error
  }
}

async function loadStudents(username) {
  const db = await connectToMongo(); // Ensure db is connected
  try {
    const user = await db.collection("USERS").findOne({ username });
    console.log("User " + user);
    const professor = user.name;
    const data = await db.collection("GRADES").find({ professor }).toArray();
    // Fe;tch all grades for the user
    return data; // Return the data instead of manipulating the DOM
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; // Propagate the error
  }
}

module.exports = { checkUser, checkRole, loadGrades, loadStudents, setGrade }; // Export the checkUser function for use in server.js
