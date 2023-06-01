const mongoose = require('mongoose');

const blacklistuserSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

const blackListUser = mongoose.model('blackListUser', blacklistuserSchema);
module.exports = blackListUser;