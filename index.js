const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gi8q3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('atgWorld');
        const servicesCollection = database.collection('blogs');

        // Get API
        app.get('/blogs', async (req, res) => {
            const cursor = servicesCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        })
        // Post API
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            console.log('hit the post api', blog);

            const result = await servicesCollection.insertOne(blog);
            console.log(result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is Running ');
});

app.listen(port, () => {
    console.log('Running Server on port:', port);
})