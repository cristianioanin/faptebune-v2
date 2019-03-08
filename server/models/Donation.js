const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  amount: Number,
  currency: {
    type: String,
    enum: ['RON', 'EUR', 'USD']
  },
  donatedFor: {
    entity: {
      type: String,
      enum: ['Cause', 'NGO']
    },
    id: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  issuedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

module.exports = mongoose.model('Donation', donationSchema);