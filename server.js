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
  loadAllGrades,
  loadUsersByRole,
  assignStudentToCourse,
  deleteUser,
} = require("./database-login"); 
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
  res.sendFile(__dirname + "/index.html"); 
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

app.get("/load-all-grades/", async (req, res) => {
  try {
    const grades = await loadAllGrades(); // Assuming loadGrades returns grades
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

app.get("/load-users-by-role/:role", async (req, res) => {
  const role = req.params.role;
  try {
    const users = await loadUsersByRole(role);
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
    res.json(students); 
  } catch (error) {
    console.error("Error loading grades:", error);
    res.status(500).send("Error loading grades");
  }
});

app.get("/delete-user/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const response = await deleteUser(username);
    res.json(response); 
  } catch (error) {
    console.error("error deleting user.", error);
    res.status(500).send("Error deleting user.");
  }
});

app.post("/add-user", async (req, res) => {
  const { name, username, password, role } = req.body;
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

app.post("/assign-student-course", async (req, res) => {
  const { professor, student, course} = req.body;

  if (!professor || !student || !course) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    await assignStudentToCourse(professor, student, course);
    res.json({ message: "student has been assigned to a course." });
  } catch (error) {
    res.status(500).send("Failed to assigned student to a course.");
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
      if (role == "professor") {
        res.redirect("/professor_page.html?username=" + username);
      } else if (role == "admin") {
        res.redirect("/admin_page.html?username=" + username);
      } else if (role == "student") {
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
