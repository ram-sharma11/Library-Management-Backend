const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        unique: true,
        required: true
    },

    bookName: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});


const book = mongoose.model('book', bookSchema);
module.exports = book;
