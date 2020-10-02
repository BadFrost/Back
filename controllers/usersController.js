'use strict'

const { ObjectID } = require('mongodb');
const mongo = require('../utils/mongoConnect');

const addUser = async (req, res) => {
    let db = mongo.getDb();
    const { name, surname, dateOfBirthday, phone, email } = req.body;
    let d = new Date();
    let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    let month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
    let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    let hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(d);
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(d);
    // Write user in db
    await db.collection('users').insertOne({ name: name, surname: surname, dateOfBirthday: dateOfBirthday, phone: phone, email: email, lastSeen: `${day}.${month}.${year} ${hour}:${minute}` });
    // Response
    res.json({
        code: 200,
        status: 'OK'
    });
};

const getUsers = async (req, res) => {
    let db = mongo.getDb();
    // Get ALL users from DB
    let users = await db.collection('users').find({}).toArray();
    // Response
    res.json({
        code: 200,
        status: 'OK',
        data: users
    });
};

const updateUser = async (req, res) => {
    let db = mongo.getDb();
    const { id, name, surname, dateOfBirthday, phone, email } = req.body;
    let d = new Date();
    let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
    let month = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
    let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    let hour = new Intl.DateTimeFormat('en', {hour12: false, hour: '2-digit'}).format(d);
    let minute = new Intl.DateTimeFormat('en', {minute: '2-digit'}).format(d);
    // Update user in DB
    let result = await db.collection('users').updateOne({ _id: new ObjectID(id) }, {$set: { name: name, surname: surname, dateOfBirthday: dateOfBirthday, phone: phone, email: email, lastSeen: `${day}.${month}.${year} ${hour}:${minute}` }});
    if (result.result.n === 0) {
        res.json({
            code: 404,
            status: 'Error',
            error: {
                errorCode: 404000,
                errorMessage: 'User not found!'
            }
        });
    } else {
        res.json({
            code: 200,
            status: 'OK'
        });
    };
};

const deleteUser = async (req, res) => {
    let db = mongo.getDb();
    const { id } = req.body;
    if (id.length < 24) {
        res.json({
            code: 409,
            status: 'Error',
            error: {
                errorCode: 409000,
                errorMessage: 'Invalid ID!'
            }
        });
    } else {
        // Find and delete user in DB
        let result = await db.collection('users').deleteOne({ _id: new ObjectID(id) });
        if (result.result.n === 0) {
            res.json({
                code: 404,
                status: 'Error',
                error: {
                    errorCode: 404000,
                    errorMessage: 'User not found!'
                }
            });
        } else {
            res.json({
                code: 200,
                status: 'OK'
            });
        };
    };
};

module.exports = { addUser, getUsers, updateUser, deleteUser }