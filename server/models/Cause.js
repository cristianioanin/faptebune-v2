const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  needsToRaise: Number,
  amountRaised: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  donations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }]
});

module.exports = mongoose.model('Cause', causeSchema);