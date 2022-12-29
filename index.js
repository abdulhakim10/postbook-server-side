const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.47nvmfs.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const postCollection = client.db('postbookDb').collection('posts');
        const commentCollection = client.db('postbookDb').collection('comments');

        app.post('/posts', async (req, res) => {
            const post = req.body;
            const posts = await postCollection.insertOne(post);
            res.send(posts);
        });

        app.get('/posts', async(req, res) => {
            const query = {};
            const options = {
                sort: {
                    "time" : -1
                }
            }
            const posts = await postCollection.find(query,options).toArray();
            res.send(posts);
        });


        // comment send to db
        app.post('/comments', async(req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });


        // get comment
        app.get('/comments', async(req, res) => {
            
            const query = {};
            const options = {
                sort: {
                    "time" : -1
                }
            }
            const result = await commentCollection.find(query, options).toArray();
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(e => console.error(e));


app.get('/', (req,res) => {
    res.send('postbook server is running');
} );

app.listen(port, (req, res) => {
    console.log('sever running on', port)
})