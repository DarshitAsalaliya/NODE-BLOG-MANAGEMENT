// Model
const PostModel = require('../models/PostModel');
const TopicModel = require('../models/TopicModel');

// API Using Async Await

// Create New Post
exports.CreatePost = async (req, res) => {
    try {
        const findTopic = await TopicModel.findById(req.body.topicid);
        if (findTopic) {
            const newPost = new PostModel({ ...req.body, userid: req.user._id, images: req.files.map((data) => data.filename) });
            await newPost.save();
            return res.status(201).send(newPost);
        }
        else {
            return res.status(400).send({ msg: "Topic is invalid.." });
        }
    } catch (e) {
        res.status(400).send({ msg: e.message });
    }
}

// Update Post
exports.UpdatePost = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['postname', 'status', 'topicid'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid Updates!' });
        }

        // Check Topic If Topic Is Changed
        if (req.body.topicid !== undefined) {
            const findTopic = await TopicModel.findById(req.body.topicid);
            if (!findTopic) {
                return res.status(400).send({ msg: "Topic is invalid.." });
            }
        }

        const _id = req.params.id;

        //Find Post For Update
        const data = await PostModel.findById(_id);

        if (!data)
            return res.status(404).send({ msg: "Not Found.." });
        updates.forEach((update) => {
            data[update] = req.body[update];
        });


        await data.save();

        res.status(200).send(data);

    } catch (e) {
        res.status(400).send(e);
    }
}

// Delete Post
exports.DeletePost = async (req, res) => {
    try {
        const data = await PostModel.findByIdAndDelete(req.params.id);

        if (!data) {
            return res.status(404).send({ msg: "Post Not Found.." });
        }

        res.status(200).send(data);
    }
    catch (e) {
        res.status(400).send(e);
    }
}

// Get All Post
exports.GetAllPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
        }

        res.status(200).send(PostList);
    } catch (e) {
        res.status(400).send(e);
    }
}

// Get Post By Topic
exports.GetPostByTopic = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true, topicid: req.params.topicid });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
        }

        res.status(200).send(PostList);
    } catch (e) {
        res.status(400).send(e);
    }
}

// Get Recent Post
exports.GetRecentPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true }, null, { sort: { createdAt: -1 } });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
        }

        res.status(200).send(PostList);
    } catch (e) {
        res.status(400).send(e);
    }
}

// Get Most Like Post
exports.GetMostLikedPost = async (req, res) => {
    try {
        const PostList = await PostModel.find({ status: true });

        // Check Post Length
        if (PostList.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
        }
        const highLike = Math.max(...PostList.map((data) => data.totallike.length));
        console.log(highLike);
        res.status(200).send(PostList.filter((data) => data.totallike.length === highLike));
    } catch (e) {
        res.status(400).send(e);
    }
}

// Like Post
exports.LikePost = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });
        console.log(req.body);
        // Check Post Length
        if (Post.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
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

        res.status(200).send(Post);
    } catch (e) {
        res.status(400).send(e.message);
    }
}

// DisLike Post
exports.DisLikePost = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });

        // Check Post Length
        if (Post.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
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

        res.status(200).send(Post);
    } catch (e) {
        res.status(400).send(e.message);
    }
}

// Add Post Comment
exports.AddPostComment = async (req, res) => {
    try {
        const Post = await PostModel.findOne({ status: true, _id: req.body.postid });

        // Check Post Length
        if (Post.length === 0) {
            return res.status(404).send({ msg: "Post not found.." });
        }

        // Add Comment
        Post.comments = Post.comments.concat({ comment: req.body.comment, userid: req.user._id });
        await Post.save();

        res.status(200).send(Post);
    } catch (e) {
        res.status(400).send(e.message);
    }
}