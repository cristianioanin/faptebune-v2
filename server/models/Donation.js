const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema({
  amount: Number,
  currency: {
    type: String,
    enum: ['RON', 'EUR', 'USD']
  },
  created: {
    type: Date,
    default: Date.now
  },
  issuedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    username: String
  }
});

module.exports = mongoose.model('donation', DonationSchema);