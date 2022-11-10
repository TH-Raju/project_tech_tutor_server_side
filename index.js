const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddpko0x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.post('/jwt', (req, res) => {
    const user = req.body;
    // console.log(user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN)
    res.send({ token })
})

async function run() {
    try {
        const serviceCollection = client.db('myService').collection('services');
        const userFeedback = client.db('myService').collection('review');

        // CRUD - Read setup

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services.reverse());
        });

        // CRUD - create setup

        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.send(result);
        });


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        //Review / feedback
        // CRUD - Create Setup

        app.post('/review', async (req, res) => {
            const review = req.body;
            const usrfeedback = await userFeedback.insertOne(review);
            res.send(usrfeedback);
        })

        // CRUD - Read setup

        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = userFeedback.find(query);
            const feedback = await cursor.sort({ dateField: -1 }).toArray();
            res.send(feedback.reverse());
        });

        //CRUD - Delete setup

        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // console.log('delete', id);
            const result = await userFeedback.deleteOne(query);
            res.send(result);
        });

        // Updating

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userFeedback.findOne(query);
            res.send(result);
        })

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const dateField = new Date();
            const updatedReview = {
                $set: {
                    person: review.person,
                    dateField,
                }
            }
            const result = await userFeedback.updateOne(filter, updatedReview, option);
            res.send(result);
        })

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