// Model
const UserModel = require('../models/UserModel');

// API Using Async Await

// Registration
exports.Registration = async (req, res) => {
    const newUser = new UserModel(req.body);
    try {
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.status(201).send({ newUser, token });
    } catch (err) {
        res.status(400).send(err);
    }
}