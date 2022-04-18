const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    Email:{
        type:String,
        required:[true, 'Email is required..'],
        unique: [true, 'Email must be unique..'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email..');
            }
        },
    },
    Password:{
        type:String
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
},{ timestamps: true });

// Generate AuthToken And Save Methods
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token: token });
    await user.save();

    return token;
}

// Middleware Before Saving Data To Hash Password
userSchema.pre('save', async function (next) {
    const user = this;
 
    if (user.isModified('Password')) {
        user.Password = await bcrypt.hash(user.Password, 8);
    }
    
    next();
});

module.exports = mongoose.model('User',userSchema,'User');