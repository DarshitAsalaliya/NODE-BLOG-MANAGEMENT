const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postname: {
        type: String,
        required: [true, 'Post name is required..'],
        minlength: [3, 'Your post name must be longer than 2 characters'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    totallike: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    ],
    totaldislike: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            }
        }
    ],
    comments: [
        {
            comment: {
                type: String,
                required: true
            },
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
            updatedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            image_url: {
                type: String,
                required: true
            }
        }
    ],
    topicid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema, 'Post');

module.exports = Post;