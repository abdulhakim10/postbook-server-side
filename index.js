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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const postCollection = client.db('postbookDb').collection('posts');
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