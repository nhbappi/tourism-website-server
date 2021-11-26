const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ajasr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('travelLover');
        const servicesCollection = database.collection('services');
        const booksCollection = database.collection("books");


      app.get('/services', async(req, res) => {
          const cursor = servicesCollection.find({});
          const services =await cursor.toArray();
          res.send(services);
    });

    app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        console.log('getting specific service', id);
        const query = { _id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })

        app.post('/services', async (req, res) =>{
          const service = req.body;
            console.log('hit the api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

         // GET book
         app.get("/books", async (req, res) => {
            const cursor = booksCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // GET BOOKING single api
        app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
        const query = { _id: ObjectId(id)}
                // const query = {email: require.body.email}
        
            const offer = await booksCollection.findOne(query)
            res.json(offer)
        });

        // // GET BOOKING single api
        // app.get("/books/:email", async (req, res) => {
        //     const query = { email: ObjectId(email)}
        //         // const query = {email: req.params.email};
       
        //     const offers = await booksCollection.find({email: req.params.email})
        
        //     res.json(offers)
        // });

        // Add Orders API
        app.post("/books", async (req, res) => {
            const order = req.body;
            // console.log("hit the post api", order);
            const result = await booksCollection.insertOne(order);

            res.json(result);
        });

        // // DELETE API
        app.delete("/books/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await booksCollection.deleteOne(query);
            console.log("deleting user with id ", result);
            res.json(result);
        });
    }
    finally{
        
    }
}

run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('Running Tourism Server');
});

app.listen(port, () =>{
    console.log('Running Tourism Genius on port', port);
})