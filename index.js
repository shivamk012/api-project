const express = require('express');
const {MongoClient} = require('mongodb');
const cors = require('cors');
const ajfdslkfa = require('body-parser');
const path = require('path');
const {deleteEvent , addEventToDatabase , findDatabase , updateEvent , getEventsByRecency} = require('./services');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(ajfdslkfa.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || '8080';

//mongodb connetion
const mongoUri = "mongodb+srv://shivamk012:shivamk012@cluster0.1sz39ps.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoUri);

async function connectMongodb(){
    try{
        await client.connect();
        console.log("connected to mongodb");
    }catch(err){
        console.log(err);
    }
}

//api calls
app.get('/api/v3/app/events' , (req,res)=>{
    // console.log(req.query.id);
    if(req.query.id === undefined){
        getEventsByRecency(client , req.query).then(res1=>{
            res.send(res1);
        })
    }
    else{
        findDatabase(client , req.query.id).then(res1=>{
            res.send(res1);
        })
    }
});

app.post('/api/v3/app/events' , (req,res)=>{
    addEventToDatabase(client , req.body).then(res1=>{
        res.send(res1.insertedId);
    });
})

app.put('/api/v3/app/events/:id' , (req,res)=>{
    console.log(req.params.id);
    console.log(req.body);
    updateEvent(client , req.params.id , req.body).then(res1=>{
        res.send(res1);
    })
})

app.delete('/api/v3/app/events/:id' , (req,res)=>{
    deleteEvent(client , req.params.id).then(res1=>{
        res.send(res1);
    })
})

console.log(`app listening on port ${port}`);
connectMongodb();
app.listen(port);
