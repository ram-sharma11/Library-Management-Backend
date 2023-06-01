const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  issueDate: {
    type: Date,
    default: Date.now()
  },
  returnDate: {
    type: Date,
    default: null

  },
  isBookReturned: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Issue", issueSchema);