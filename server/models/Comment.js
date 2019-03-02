const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  text: String,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    username: String
  }
});

module.exports = mongoose.model('comment', CommentSchema);