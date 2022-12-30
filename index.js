const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.47nvmfs.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const userCollection = client.db('postbookDb').collection('users');
        const postCollection = client.db('postbookDb').collection('posts');
        const commentCollection = client.db('postbookDb').collection('comments');
        const likeCollection = client.db('postbookDb').collection('likes');


        // add users
        app.post('/users', async(req, res) => {
            const user = req.body;
            const query = {email: user.email};
            const exist = await userCollection.findOne(query);
            // console.log(exist.email)
            if(exist?.email === user.email){
                return res.status(403).send('already exist');
            }
            else{
                const result = await userCollection.insertOne(user);
                res.send(result);
            }
            // console.log(result)
        });


        // update profile
        app.put('/update', async(req, res) => {
            const updatedProfile = req.body;
            const email = req.query.email;
            const filter = {email};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    displayName: updatedProfile.displayName,
                    address: updatedProfile.address,
                    university: updatedProfile.university,
                    bio: updatedProfile.bio,
                    photoURL: updatedProfile.photoURL
                }
                
            };
            const result = await userCollection.updateMany(filter, updatedDoc, options);
            res.send(result);
        });


        // get user by email
        app.get('/user', async(req, res) => {
            const email = req.query.email;
            const filter = {email}
            const result = await userCollection.findOne(filter);
            res.send(result);
        });


        // add post to db
        app.post('/posts', async (req, res) => {
            const post = req.body;
            const posts = await postCollection.insertOne(post);
            res.send(posts);
        });



        // get post
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



        // add like to db
        app.post('/likes', async(req, res) => {
            const likeInfo = req.body;
            
                const result = await likeCollection.insertOne(likeInfo);
            res.send(result);
            
        });


        // get likes
        app.get('/likes/:id', async(req, res) => {
            const id = req.params.id;
            const query = {postId: id};
            const result = await likeCollection.find(query).toArray();
            res.send(result);
        })


        // add comment to db
        app.post('/comments', async(req, res) => {
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result);
        });


        // get comment
        app.get('/comments/:id', async(req, res) => {
            const id = req.params.id;
            const query = {postId: id};
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