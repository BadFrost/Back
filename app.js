'use strict'

const bodyParser = require('body-parser');
const express = require('express');
const mongo = require('./utils/mongoConnect');
const { addUser, getUsers, updateUser, deleteUser } = require('./controllers/usersController');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/addUser', (req, res) => {
    addUser(req, res);
});

app.get('/getUsers', (req, res) => {
    getUsers(req, res);
});

app.post('/updateUser', (req, res) => {
    updateUser(req, res);
});

app.post('/deleteUser', (req, res) => {
    deleteUser(req, res);
});

mongo.connectToServer(err => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log('MongoDB connected!');
            console.log('App listening on http://localhost:3000');
        });
    };
});