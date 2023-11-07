const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4gyyvr.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db("foodSharing").collection("foodItem");
  


    app.get('/foodItem' ,async(req,res)=>{
      const cursor =foodCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/foodItem/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const options = {
        // Sort matched documents in descending order by rating
        
        // Include only the `title` and `imdb` fields in the returned document
        projection: {  name:1, quantity: 1,location: 1,expiration_date: 1,food_image: 1,donator_name: 1 },
      };
      const result =await foodCollection.findOne(query ,options);
      res.send(result)
    })

    app.post('/foodItem',async(req,res)=>{
      const newFood= req.body
      console.log(newFood)
      const result =await foodCollection.insertOne(newFood)
      res.send(result)
    })

  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})