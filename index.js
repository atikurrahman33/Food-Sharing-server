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
    const reqFoodItem = client.db("foodSharing").collection("reqFoodItem");
  


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
        projection: {  name:1, quantity: 1,location: 1,expiration_date: 1,food_image: 1,donator_name: 1,email: 1 },
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


    app.get('/myFoodItem', async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = foodCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });



    app.delete('/foodItem/:id', async(req, res) => {
      const id= req.params.id
      console.log('delete id',id)
      const query = {_id:new ObjectId(id)  };
      const result = await foodCollection.deleteOne(query);
      res.send(result);    
    })

    app.patch('/foodItem/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = req.body;
      console.log(updateFood);
      const foods = {
        $set: {
          name: updateFood.name,
          food_image: updateFood.food_image,
          status: updateFood.status,
          quantity: updateFood.quantity,
          location: updateFood.location,

        }
      }

      const result = await foodCollection.updateOne(filter, foods, options);
      res.send(result)
    })

  //  request
    app.post('/reqFoodItem',async(req,res)=>{
      const newFood= req.body
      console.log(newFood)
      const result =await reqFoodItem.insertOne(newFood)
      res.send(result)
    })

    app.get('/reqFoodItem', async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = reqFoodItem.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/manageFood/:text', async (req, res) => {
      try {
          const searchText = req.params.text;
          const searchResult = await reqFoodItem.find({
              $or: [
                  { name: { $regex: searchText, $options: 'i' } }
              ]
          }).toArray();

          res.json(searchResult);
      } catch (error) {
          console.error("Error searching :", error);
          res.status(500).json({ error: "Internal server error" });
      }
  });

    app.delete('/reqFoodItem/:id', async(req, res) => {
      const id= req.params.id
      console.log('delete id',id)
      const query = {_id:new ObjectId(id)  };
      const result = await reqFoodItem.deleteOne(query);
      res.send(result);    
    })

    app.patch('/foodItem/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateFood = req.body;
      console.log(updateFood);
      const foods = {
        $set: {
          name: updateFood.name,
          food_image: updateFood.food_image,
          status: updateFood.status,
          quantity: updateFood.quantity,
          location: updateFood.location,

        }
      }

      const result = await foodCollection.updateOne(filter, foods, options);
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