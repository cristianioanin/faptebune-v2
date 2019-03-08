require('../config/passport-setup');

const express = require('express');
const router = express.Router({
  mergeParams: true
});
const passport = require('passport');
const Donation = require('../models/Donation');
const NGO = require('../models/NGO');
const Cause = require('../models/Cause');
const {
  allowIfAdmin
} = require('../helpers/routesHelpers');

// INDEX Route
router.get('/', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  Donation.find({}, (err, donations) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(donations);
    }
  });
});

// SHOW Route
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  Donation.findById(req.params.id, (err, donation) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(donation);
    }
  });
});

// UPDATE Route
router.put('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  Donation.findByIdAndUpdate(req.params.id, req.body.donation, (err, oldDonation) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(oldDonation);
    }
  });
});

// DELETE Route
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  Donation.findByIdAndRemove(req.params.id, (err, donation) => {
    if (err || !donation) {
      res.status(400).json(err);
    } else {
      const model = donation.donatedFor.entity;
      if (model === 'NGO') {
        NGO.findById(donation.donatedFor.id, (err, dbModel) => {
          if (err || !dbModel) {
            res.status(400).json(err);
          } else {
            const index = dbModel.donations.indexOf(donation._id);
            dbModel.donations.splice(index, 1);
            dbModel.amountRaised -= donation.amount;
            dbModel.save();

            res.status(202).json(donation);
          }
        });
      } else if (model === 'Cause') {
        Cause.findById(donation.donatedFor.id, (err, dbModel) => {
          if (err || !dbModel) {
            res.status(400).json(err);
          } else {
            const index = dbModel.donations.indexOf(donation._id);
            dbModel.donations.splice(index, 1);
            dbModel.amountRaised -= donation.amount;
            dbModel.save();

            res.status(202).json(donation);
          }
        });
      }
    }
  });
});

module.exports = router;