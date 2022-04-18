const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, 'Email is required..'],
        unique: [true, 'Email must be unique..'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email..');
            }
        },
    },
    password:{
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
 
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
});

// Login Validation
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });
 
    if (!user) {
        throw new Error('Unable to login..');
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login..');
    }

    return user;
}

// Get Necessary Parameter
userSchema.methods.getPublicProfile = async function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const User = mongoose.model('User',userSchema,'User');

module.exports = User;