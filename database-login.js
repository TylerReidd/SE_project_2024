const { MongoClient } = require("mongodb");


const uri =
  "mongodb+srv://tylerreid1988:LF1uvZFMm9XYmhQN@cluster0.im4vf.mongodb.net/"; 
const dbName = "SE-2024"; 


async function connectToMongo() {
  const client = new MongoClient(uri);
  await client.connect(); 
  return client.db(dbName); 
}


async function checkUser(username, password) {
  const db = await connectToMongo(); 

  try {

    const user = await db.collection("USERS").findOne({ username });
    if (user.username == username && user.password == password) {
      return true;
    } else {
      return false;
    }
   
  } catch (error) {
    console.error("Error checking user:", error); 
    throw error; 
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
  const db = await connectToMongo(); 
  try {
    await db
      .collection("GRADES")
      .updateOne({ name: username }, { $set: { grade: grade } }); 
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}

async function addUser(name, username, password, role) {
  const db = await connectToMongo(); 
  try {
    const user = {
      name: name,
      username: username,
      password: password,
      role: role,
    };
    await db.collection("USERS").insertOne(user); 
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}

async function deleteUser(passedUsername) {
  console.log("Username in DB is: " + passedUsername)
  const db = await connectToMongo(); 
  try {

    const filter = { username: passedUsername };

    await db.collection("USERS").deleteOne(filter); 
    return passedUsername;

  } catch (error) {
    console.error("Error deleting the user:", error);
    throw error; 
  }
}

async function assignStudentToCourse(passedProfessor, passedStudent, passedCourse) {
  const db = await connectToMongo(); 
  const name = passedStudent;
  console.log("professor in DL: " + passedProfessor);
  console.log("student in DL: " + passedStudent);
  console.log("course in DL: " + passedCourse);
  try {
    const data = await db.collection("GRADES").find({ passedStudent }).toArray(); 
    const user = await db.collection("USERS").findOne({ name }); 
    if(data.length > 0)
    {
      console.error("Student already assigned to course.")
    }
    else
    {
      const grade = {
        professor: passedProfessor,
        student: passedStudent,
        classname: passedCourse,
        grade: "N/A",
        username: user.username,
      };
      await db.collection("GRADES").insertOne(grade);
    }
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}

async function loadGrades(username) {
  const db = await connectToMongo(); 
  try {
    const data = await db.collection("GRADES").find({ username }).toArray(); // 
    return data; 
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}

async function loadAllGrades() {
  const db = await connectToMongo(); 
  try {
    const data = await db.collection("GRADES").find({ }).toArray(); 
    return data; 
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}


async function loadUsers() {
  const db = await connectToMongo();
  try {
    const users = await db.collection("USERS").find({}).toArray();
    return users; 
  } catch (error) {
    console.error("Error loading users:", error);
    throw error; 
  }
}

async function loadUsersByRole(role) {
  const db = await connectToMongo(); 
  try {
    const users = await db.collection("USERS").find({ role }).toArray();
    return users; 
  } catch (error) {
    console.error("Error loading users:", error);
    throw error;
  }
}

async function loadStudents(username) {
  const db = await connectToMongo();
  try {
    const user = await db.collection("USERS").findOne({ username });
    console.log("User " + user);
    const professor = user.name;
    const data = await db.collection("GRADES").find({ professor }).toArray();
    
    return data; 
  } catch (error) {
    console.error("Error loading data:", error);
    throw error; 
  }
}

module.exports = { checkUser, checkRole, loadGrades, loadStudents, setGrade, addUser, loadUsers, loadAllGrades, loadUsersByRole, assignStudentToCourse, deleteUser };
