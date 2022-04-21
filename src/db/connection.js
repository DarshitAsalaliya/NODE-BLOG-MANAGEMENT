const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true
});