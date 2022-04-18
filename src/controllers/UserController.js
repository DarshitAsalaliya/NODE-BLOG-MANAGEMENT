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
    } catch (e) {
        res.status(400).send(e);
    }
}

// Login GenerateToken
exports.Login = async (req, res) => {
    try {
        
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        
      
        const token = await user.generateAuthToken();
        res.send({ user: await user.getPublicProfile(), token });
    } catch (e) {
        res.status(400).send(e);
    }
}