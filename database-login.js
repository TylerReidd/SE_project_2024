const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());  // For parsing JSON request bodies

// Secret for JWT (You should store it securely in environment variables)
const JWT_SECRET = 'your_jwt_secret_key';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    // Check if the user exists in the database
    const user = await usersCollection.findOne({ email });

    if (user) {
      // User exists, validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send('Invalid credentials.');
      }
    } else {
      // User doesn't exist, create a new user
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for security

      const newUser = {
        email: email,
        password: hashedPassword,
        createdAt: new Date(),
      };

      await usersCollection.insertOne(newUser);
      console.log('New user created:', email);
    }

    // Generate a JWT for authentication
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful!', token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});

// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
