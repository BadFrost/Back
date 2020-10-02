'use strict'

const bodyParser = require('body-parser');
const express = require('express');
const { body, validationResult } = require('express-validator');
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

app.post('/addUser', [
    body('name')
    .not().isEmpty()
    .withMessage({errorCode: 409006, errorMessage: 'Name should not be empty'})
    .bail()
    .isLength({min:1, max: 60})
    .withMessage({errorCode: 409001, errorMessage: 'Name should be between 1 and 60'}),
    body('surname')
    .not().isEmpty()
    .withMessage({errorCode: 409007, errorMessage: 'Surname should not be empty'})
    .bail()
    .isLength({min: 1, max: 60})
    .withMessage({errorCode: 409002, errorMessage: 'Surname should be between 1 and 60'}),
    body('dateOfBirthday')
    .not().isEmpty()
    .withMessage({errorCode: 409008, errorMessage: 'DateOfBirthday should not be empty'})
    .bail()
    .matches(/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g)
    .withMessage({errorCode: 409003, errorMessage: 'Invalid date'}),
    body('phone')
    .not().isEmpty()
    .withMessage({errorCode: 409009, errorMessage: 'Phone should not be empty'})
    .bail()
    .matches(/^(0)([0-9][0-9])[0-9]{7}$/g)
    .withMessage({errorCode: 409004, errorMessage: 'Invalid phone'}),
    body('email')
    .not().isEmpty()
    .withMessage({errorCode: 409010, errorMessage: 'Email should not be empty'})
    .bail()
    .isEmail()
    .withMessage({errorCode: 409005, errorMessage: 'Invalid email'})
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            code: 409,
            message: 'Error',
            errors: errors.array()
        })        
    } else {
        addUser(req, res);
    };
});

app.get('/getUsers', (req, res) => {
    getUsers(req, res);
});

app.post('/updateUser', [
    body('id')
    .not().isEmpty()
    .withMessage({errorCode: 409011, errorMessage: 'ID should not be empty'})
    .bail()
    .isLength({min: 24, max: 24})
    .withMessage({errorCode: 409012, errorMessage: 'ID should be 24 symbols length'}),
    body('name')
    .not().isEmpty()
    .withMessage({errorCode: 409006, errorMessage: 'Name should not be empty'})
    .bail()
    .isLength({min:1, max: 60})
    .withMessage({errorCode: 409001, errorMessage: 'Name should be between 1 and 60'}),
    body('surname')
    .not().isEmpty()
    .withMessage({errorCode: 409007, errorMessage: 'Surname should not be empty'})
    .bail()
    .isLength({min: 1, max: 60})
    .withMessage({errorCode: 409002, errorMessage: 'Surname should be between 1 and 60'}),
    body('dateOfBirthday')
    .not().isEmpty()
    .withMessage({errorCode: 409008, errorMessage: 'DateOfBirthday should not be empty'})
    .bail()
    .matches(/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g)
    .withMessage({errorCode: 409003, errorMessage: 'Invalid date'}),
    body('phone')
    .not().isEmpty()
    .withMessage({errorCode: 409009, errorMessage: 'Phone should not be empty'})
    .bail()
    .matches(/^(0)([0-9][0-9])[0-9]{7}$/g)
    .withMessage({errorCode: 409004, errorMessage: 'Invalid phone'}),
    body('email')
    .not().isEmpty()
    .withMessage({errorCode: 409010, errorMessage: 'Email should not be empty'})
    .bail()
    .isEmail()
    .withMessage({errorCode: 409005, errorMessage: 'Invalid email'})
], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            code: 409,
            message: 'Error',
            errors: errors.array()
        })        
    } else {
        updateUser(req, res);
    };
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