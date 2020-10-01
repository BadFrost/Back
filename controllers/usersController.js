'use strict'

const { ObjectID } = require('mongodb');
const mongo = require('../utils/mongoConnect');

const addUser = async (req, res) => {
    let db = mongo.getDb();
    const { name, surname, dateOfBirthday, phone, email } = req.body;
    // Write user in db
    await db.collection('users').insertOne({ name: name, surname: surname, dateOfBirthday: dateOfBirthday, phone: phone, email: email, lastSeen: Date.now() });
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
    // Update user in DB
    await db.collection('users').updateOne({ _id: new ObjectID(id) }, {$set: { name: name, surname: surname, dateOfBirthday: dateOfBirthday, phone: phone, email: email, lastSeen: Date.now() }});
    // Response
    res.json({
        code: 200,
        status: 'OK'
    });
};

const deleteUser = async (req, res) => {
    let db = mongo.getDb();
    const { id } = req.body;
    // Fing and delete user in DB
    await db.collection('users').deleteOne({ _id: new ObjectID(id) });
    // Response
    res.json({
        code: 200,
        status: 'OK'
    });
};

module.exports = { addUser, getUsers, updateUser, deleteUser }