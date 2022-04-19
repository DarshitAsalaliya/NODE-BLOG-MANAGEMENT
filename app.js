const express = require('express');
const app = express();

// DOTENV
require('dotenv').config();
const port = process.env.PORT || 3000;

// For JSON Support
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Connection
require('./src/db/connection');

// Set Employee Router
const userRoute = require('./src/routes/UserRoute');
app.use(userRoute);

// Set Topic Router
const topicRoute = require('./src/routes/TopicRoute');
app.use(topicRoute);

// Set Post Router
const postRoute = require('./src/routes/PostRoute');
app.use(postRoute);

app.listen(port, () => { });