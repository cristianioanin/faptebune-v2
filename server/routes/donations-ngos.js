require('../config/passport-setup');

const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const { allowIfAdmin } = require('../helpers/routesHelpers');

// INDEX Route
router.get('/', (req, res) => {
  NGO.findById(req.params.id, 'donations').populate('donations').exec((err, ngoRecord) => {
    if (err || ngoRecord === null) {
      res.status(400).json(err);
    } else {
      res.status(200).json(ngoRecord);
    }
  });
});

// CREATE Route
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  NGO.findById(req.params.id, (err, NGORecord) => {
    if (err || !NGORecord) {
      res.status(400).json(err);
    } else {
      Donation.create(req.body.donation, (err, donation) => {
        if (err) {
          res.status(400).json(err);
        } else {
          const authMethod = req.user.authMethod;
          donation.issuedBy.id = req.user._id;
          donation.issuedBy.username = req.user[authMethod].username;
          donation.save();

          NGORecord.donations.push(donation);
          NGORecord.save();

          res.status(201).json(donation);
        }
      });
    }
  });
});

// UPDATE Route
router.put('/:donation_id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Donation.findByIdAndUpdate(req.params.donation_id, req.body.donation, (err, oldDonation) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(oldDonation);
    }
  });
});

// DESTROY Route
router.delete('/:donation_id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Donation.findByIdAndRemove(req.params.donation_id, (err, donationRecord) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(donationRecord);
    }
  });
});

module.exports = router;