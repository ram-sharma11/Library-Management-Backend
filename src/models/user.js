const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    name: {
        type: String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "subAdmin", "user"],
        default: "user"
    },

    havePermission: {
        type: Boolean,
        default: false
    },
    noOfAssignedBooks:{
        type : Number,
        default : 0
    }
    
});

const User = mongoose.model('User', userSchema);
module.exports = User;