// Model
const TopicModel = require('../models/TopicModel');

// API Using Async Await

// Create New Topic
exports.CreateTopic = async (req, res) => {
    try {
        const newTopic = new TopicModel({ ...req.body, userid: req.user._id });
        await newTopic.save();
        return res.status(201).send(newTopic);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}

// Get All Topic
exports.GetAllTopic = async (req, res) => {
    try {
        const topicList = await TopicModel.find({ status: true });

        // Check Topic Length
        if (topicList.length === 0) {
            return res.status(404).send({ error: "Topic not found.." });
        }

        return res.status(200).send(topicList);
    } catch (e) {
        return res.status(400).send({ error: e.message });
    }
}
