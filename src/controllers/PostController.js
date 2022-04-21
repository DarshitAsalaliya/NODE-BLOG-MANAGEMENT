var fs = require('fs');
const cloudinary = require('cloudinary');

// Model
const PostModel = require('../models/PostModel');
const TopicModel = require('../models/TopicModel');

// Util
const { checkParameters } = require('../middleware/utils');

// API Using Async Await

// Create New Post
exports.CreatePost = async (req, res) => {
    try {
        const findTopic = await TopicModel.findById(req.body.topicid);
        if (findTopic) {

            //Map through images and create a promise array using cloudinary upload function
            let multiplePicturePromise = req.files.map((data) => {
                return cloudinary.v2.uploader.upload(data.path, {
                    folder: 'postimages',
                    public_id: data.filename,
                    crop: "fit",
                    allowedFormats: ['jpg', 'jpeg', 'png']
                }, (err) => {
                    if (err) {
                        throw new Error(err.message);
                    }
                });
            }
            );

            // Await all the cloudinary upload functions in promise.all
            let imageResponses = await Promise.all(multiplePicturePromise);

            const newPost = new PostModel({ ...req.body, userid: req.user._id, images: imageResponses.map((data) => { return { public_id: data.public_id, image_url: data.secure_url } }) });
            await newPost.save();

            return res.status(201).send(newPost);
        }
        else {
            return res.status(400).send({ error: "Topic is invalid.." });
        }
    } catch (e) {

        // Delete Uploaded Files
        req.files.forEach((data) => {
            fs.unlink('./public/postimages/' + data.filename, (err) => { });
        });

        // Delete Uploaded File From Cloudinary        
        //Map through images and create a promise array using cloudinary upload function
        let deleteMultiplePicturePromise = req.files.map((data) => {
            return cloudinary.v2.uploader.destroy('postimages/' + data.filename);
        }
        );

        // Await all the cloudinary upload functions in promise.all
        let imageResponses = await Promise.all(deleteMultiplePicturePromise);

        return res.status(400).send({ error: e.message });
    }
}

// Update Post
exports.UpdatePost = async (req, res) => {
    try {

        if (!checkParameters(req.body, ['postname', 'status', 'topicid'])) {
            return res.status(400).send({ error: 'Invalid Parameters..' });
        }

        // Check Topic If Topic Is Changed
        if (req.body.topicid !== undefined) {
            const findTopic = await TopicModel.findById(req.body.topicid);
            if (!findTopic) {
                return res.status(400).send({ error: "Topic is invalid.." });
            }
        }

        const _id = req.params.id;

        //Find Post For Update
        const data = await PostModel.findById(_id);

        if (!data)
            return res.status(404).send({ error: "Not Found.." });

        Object.keys(req.body).forEach((update) => {
            data[update] = req.body[update];
        });

        await data.save();

        return res.status(200).send(data);

    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Delete Post
exports.DeletePost = async (req, res) => {
    try {
        const data = await PostModel.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).send({ error: "Post Not Found.." });
        }

        //Map through images and create a promise array using cloudinary upload function
        let multiplePicturePromise = data.images.map((d) => {
            return cloudinary.v2.uploader.destroy(d.public_id);
        }
        );

        // Await all the cloudinary upload functions in promise.all
        let imageResponses = await Promise.all(multiplePicturePromise);

        // Delete Uploaded Files From Local Folder
        data.images.forEach((d) => {
            fs.unlink('./public/' + d.public_id, (err) => { });
        });

        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Get All Post
exports.GetAllPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ error: "Post not found.." });
        }

        return res.status(200).send(PostList);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Get Post By Topic
exports.GetPostByTopic = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true, topicid: req.params.topicid });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ error: "Post not found.." });
        }

        return res.status(200).send(PostList);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Get Recent Post
exports.GetRecentPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true }, null, { sort: { createdAt: -1 } }).limit(1);

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ error: "Post not found.." });
        }

        return res.status(200).send(PostList);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Get Most Like Post
exports.GetMostLikedPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ error: "Post not found.." });
        }
        const highLike = Math.max(...PostList.map((data) => data.totallike.length));

        PostList.forEach((data) => {
            if (data.totallike.length === highLike) {
                return res.status(200).send(data);
            }
        });

    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Like Post
exports.LikePost = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });

        // Check Post Length
        if (!Post) {
            return res.status(404).send({ error: "Post not found.." });
        }

        if (Post.totallike.filter((obj) => obj.userid == String(req.user._id)).length > 0) {
            Post.totallike = Post.totallike.filter((obj) => obj.userid != String(req.user._id));
            await Post.save();
            return res.status(200).send(Post);
        }

        if (Post.totaldislike.filter((obj) => obj.userid == String(req.user._id)).length > 0) {
            Post.totaldislike = Post.totaldislike.filter((obj) => obj.userid != String(req.user._id));
        }

        // Add Like
        Post.totallike = Post.totallike.concat({ userid: req.user._id });
        await Post.save();

        return res.status(200).send(Post);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// DisLike Post
exports.DisLikePost = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });

        // Check Post Length
        if (!Post) {
            return res.status(404).send({ error: "Post not found.." });
        }

        if (Post.totaldislike.filter((obj) => obj.userid == String(req.user._id)).length > 0) {
            Post.totaldislike = Post.totaldislike.filter((obj) => obj.userid != String(req.user._id));
            await Post.save();
            return res.status(200).send(Post);
        }

        if (Post.totallike.filter((obj) => obj.userid == String(req.user._id)).length > 0) {
            Post.totallike = Post.totallike.filter((obj) => obj.userid != String(req.user._id));
        }

        // Add Dislike
        Post.totaldislike = Post.totaldislike.concat({ userid: req.user._id });
        await Post.save();

        return res.status(200).send(Post);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Add Post Comment
exports.AddPostComment = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });

        // Check Post Length
        if (!Post) {
            return res.status(404).send({ error: "Post not found.." });
        }

        // Add Comment
        Post.comments = Post.comments.concat({ comment: req.body.comment, userid: req.user._id });
        await Post.save();

        return res.status(200).send(Post);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}