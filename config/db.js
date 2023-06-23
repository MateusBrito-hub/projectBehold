//dotenv
const dotenv = require('dotenv')
dotenv.config()
const { DB_PASSWORD } = process.env
//Database Config
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://MateusBrito:${DB_PASSWORD}@beholder.y0w8xla.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const Database = new MongoClient(uri, {
  bufferTimeoutMS: 30000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await Database.connect();
    // Send a ping to confirm a successful connection
    await Database.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await Database.close();
  }
}
run().catch(console.dir);


module.exports = Database