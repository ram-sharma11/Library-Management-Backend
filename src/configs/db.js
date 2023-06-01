const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MongoDB_URI = process.env.MongoDB_URI;

mongoose.connect(MongoDB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log(`Connected to Database : ${MongoDB_URI}`);
});

module.exports = db;