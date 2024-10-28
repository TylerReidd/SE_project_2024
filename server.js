const express = require("express");
const bodyParser = require("body-parser");
const {
  checkUser,
  checkRole,
  loadGrades,
  loadStudents,
  setGrade,
  addUser,
  loadUsers,
} = require("./database-login"); // Import the checkUser function
const { MongoClient } = require("mongodb");

// Initialize the express app
const app = express();

// Middleware to parse form data (urlencoded for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection string and database name
const uri =
  "mongodb+srv://tylerreid1988:LF1uvZFMm9XYmhQN@cluster0.im4vf.mongodb.net/";
const dbName = "SE-2024";

// Function to connect to MongoDB
async function connectToMongo() {
  const client = new MongoClient(uri, {});
  await client.connect();
  return client.db(dbName);
}

// Serve the HTML login page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Serve the login page (index.html)
});

//Serve the html professor page
app.get("/professor_page.html", (req, res) => {
  res.sendFile(__dirname + "/professor_page.html");
});

//serve the html student page
app.get("/student_page.html", (req, res) => {
  res.sendFile(__dirname + "/student_page.html");
});

//serve the html admin page
app.get("/admin_page.html", (req, res) => {
  res.sendFile(__dirname + "/admin_page.html");
});

app.get("/load-grades/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const grades = await loadGrades(username); // Assuming loadGrades returns grades
    res.json(grades); // Send grades as JSON
  } catch (error) {
    console.error("Error loading grades:", error);
    res.status(500).send("Error loading grades");
  }
});

app.get("/load-users", async (req, res) => {
  try {
    const users = await loadUsers();
    res.json(users);
  } catch (error) {
    console.error("Error loading users:", error);
    res.status(500).send("Error loading users");
  }
});

app.get("/load-students/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const students = await loadStudents(username);
    console.log("STUDENTS: " + students); // Assuming loadGrades returns grades
    res.json(students); // Send grades as JSON
  } catch (error) {
    console.error("Error loading grades:", error);
    res.status(500).send("Error loading grades");
  }
});

app.post("/add-user", async (req, res) => {
  const { name, username, password, role } = req.body;
  console.log("Name in Server: " + name);
  console.log("Username in Server: " + username);
  console.log("Password in Server: " + password);
  console.log("Role in Server: " + role);

  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    await addUser(name, username, password, role);
    res.json({ message: "user has been made" });
  } catch (error) {
    res.status(500).send("Failed to create user");
  }
});

app.post("/set-grade", async (req, res) => {
  const { username, grade } = req.body;

  if (!username || !grade) {
    res.status(400).send("Username or grade missing");
    return;
  }

  try {
    await setGrade(username, grade);
    res.json({ message: "Grade updated successfully" });
  } catch (error) {
    res.status(500).send("Failed to update grade");
  }
});

// POST route to handle login form submission
app.post("/database-login.js", async (req, res) => {
  const { username, password } = req.body; // Get username and password from form submission
  const db = await connectToMongo(); // Connect to the MongoDB database

  try {
    // Query the users collection to check if the user exists
    const user = await checkUser(username, password);

    // If user exists, login is successful
    if (user) {
      const role = await checkRole(username);
      if (role == "prof") {
        res.redirect("/professor_page.html?username=" + username);
      } else if (role == "admin") {
        res.redirect("/admin_page.html?username=" + username);
      } else if (role == "stud") {
        res.redirect("/student_page.html?username=" + username);
      }
      // res.send('Login successful!' + role);
    } else {
      // If user doesn't exist, send an error message
      res.send("Invalid username or password");
    }
  } catch (error) {
    // Handle any errors during database query
    res.status(500).send("Error connecting to the database");
  }
});

// Start the server and listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
