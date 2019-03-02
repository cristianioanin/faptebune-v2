const mongoose = require('mongoose');

const CauseSchema = new mongoose.Schema({
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
      ref: 'user'
    }
  },
  needsToRaise: Number,
  amountRaised: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'comment'
    }
  ],
  donations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'donation'
    }
  ]
});

module.exports = mongoose.model('cause', CauseSchema);