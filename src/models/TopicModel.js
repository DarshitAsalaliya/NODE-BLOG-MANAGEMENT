const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topicname: {
        type: String,
        required: [true, 'Topic is required..'],
        unique: [true, 'Topic must be unique..'],
        trim:true,
    },
    status: {
        type: Boolean,
        default: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema, 'Topic');

module.exports = Topic;