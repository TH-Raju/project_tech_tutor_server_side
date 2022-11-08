const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddpko0x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('myService').collection('services');
        const userFeedback = client.db('myService').collection('review');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        //Review / feedback

        app.post('/review', async (req, res) => {
            const review = req.body;
            const usrfeedback = await userFeedback.insertOne(review);
            res.send(usrfeedback);
        })

        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = userFeedback.find(query);
            const feedback = await cursor.toArray();
            res.send(feedback);
        });


    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send("API Working...");
})
app.listen(port, () => {
    console.log(`Server Running...${port}`)
})