const express = require('express');
const app = express();

// DOTENV
require('dotenv').config();
const port = process.env.PORT || 3000;

// For JSON Support
app.use(express.json());

// Connection
require('./src/db/connection');

// Set Employee Router
const userRoute = require('./src/routes/UserRoute');
app.use(userRoute);

app.listen(port,()=>{});