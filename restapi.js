
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongoUrl = "mongodb+srv://avinash:avinash@restaurent-api.b6sbj.mongodb.net/restaurentapp?retryWrites=true&w=majority";
const cors = require('cors');
const bodyParser = require('body-parser');
let db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    res.send(`<div><a href='https://edumot.herokuapp.com/location'>Location</a><br/><a href='https://edumot.herokuapp.com/mealtype'>MealType</a><br/><a href='https://edumot.herokuapp.com/cuisine'>Cuisine</a><br/><a href='https://edumot.herokuapp.com/restaurent'>Restaurent</a></div>`)
})

//City List
app.get('/location',(req,res) => {
    db.collection('location').find({}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//Meal Type
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Cusine
app.get('/cuisine',(req,res) => {
    db.collection('cuisine').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//Restaurant
app.get('/restaurant',(req,res) => {
    var query = {};
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        query={city:req.query.city}
    }
    else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurent').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurentDetails/:id',(req,res) => {
    console.log(req.params.id)
    var query = {_id:req.params.id}
    db.collection('restaurent').find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

////////////////////////Listing Page Api//////////////
app.get('/restaurantlist/:mealtype', (req,res) => {
    var query = {"type.mealtype":req.params.mealtype};
    var sort = {cost:-1}
    if(req.query.city && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"city":req.query.city}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.cuisine  && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":(req.query.cuisine)}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.lcost && req.query.hcost && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"cost":{$lt:parseInt(req.query.lcost),$gt:parseInt(req.query.hcost)} }
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.city){
        query={"type.mealtype":req.params.mealtype,"city":req.query.city}
    }else if(req.query.cuisine){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":(req.query.cuisine)}
    }else if(req.query.lcost && req.query.hcost){
        query={"type.mealtype":req.params.mealtype,"cost":{$lt:parseInt(req.query.lcost),$gt:parseInt(req.query.hcost)} }
    }
    else if(req.query.sort){
        query={"type.mealtype":req.params.mealtype}
        sort={cost:Number(req.query.sort)}
    }
    db.collection('restaurent').find(query).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

//orders
app.get('/orders',(req,res) => {
    db.collection('orders').find({}).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

//placeorder
app.post('/placeorder',(req,res) => {
    db.collection('orders').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
});


MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log(err);
    db = client.db('restaurentapp');
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})
