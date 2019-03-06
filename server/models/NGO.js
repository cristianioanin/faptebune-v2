const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
  name: String,
  logo: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  created: {
    type: Date,
    default: Date.now
  },
  author: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

module.exports = mongoose.model('NGO', NGOSchema);