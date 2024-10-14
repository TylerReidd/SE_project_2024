const { MongoClient } = require('mongodb');

async function createMongoClient() {
  const client = new MongoClient('your_mongodb_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.error(err);
  }
}

const client = createMongoClient();
const db = client.db('usersDatabase');  // Assuming your database is named 'usersDatabase'
const usersCollection = db.collection('users');