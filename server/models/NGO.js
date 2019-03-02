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
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
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

module.exports = mongoose.model('ngo', NGOSchema);