var fs = require('fs');
const cloudinary = require('cloudinary');

// Model
const UserModel = require('../models/UserModel');

// API Using Async Await

// Registration
exports.Registration = async (req, res) => {
    try {

        const newUser = new UserModel({ ...req.body, image: req.file.filename });
        await newUser.save();
        const token = await newUser.generateAuthToken();

        // Upload Image To Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'userimages',
            public_id: req.file.filename,
            crop: "fit",
            allowedFormats: ['jpg', 'jpeg', 'png']
        }, (err) => {
            if (err) {
                throw new Error(err.message);
            }
        });

        res.status(201).send({ newUser, token });
    } catch (e) {
        // Delete Uploaded File
        fs.unlink('./public/userimages/' + req.file.filename, (err) => { });
        res.status(400).send({ error: e.message });
    }
}

// Login GenerateToken
exports.Login = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['email', 'password'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Parameters..' });
        }

        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user: await user.getPublicProfile(), token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
}