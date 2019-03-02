require('../config/passport-setup');

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Cause = require('../models/Cause');
const { allowIfAdmin, allowCauseEditing } = require('../helpers/routesHelpers');

const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

// INDEX Route
router.get('/', (req, res) => {
  Cause.find({}, (err, causes) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(causes);
    }
  });
});

// CREATE Route
router.post('/', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  const { name, description, location, needsToRaise } = req.body;
  const author = {
    id: req.user._id
  }
  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      return res.status(400).json({
        error: 'Provided address could not be matched through Geocoding API'
      });
    }

    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newCause = { name, location, needsToRaise, lat, lng, description, author };

    Cause.create(newCause, (err, causeRecord) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(causeRecord);
      }
    });
  });
});

// SHOW Route
router.get('/:id', (req, res) => {
  Cause.findById(req.params.id).populate('comments').exec((err, causeRecord) => {
    if (err || causeRecord === null) {
      res.status(400).json({
        error: err.message
      });
    } else {
      res.status(200).json(causeRecord);
    }
  });
});

// UPDATE Route
router.put('/:id', passport.authenticate('jwt', { session: false }), allowCauseEditing, (req, res) => {

  const { name, description, location, needsToRaise } = req.body;

  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      return res.status(400).json({
        error: 'Provided address could not be matched through Geocoding API'
      });
    }

    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newCauseData = { name, location, lat, lng, description, needsToRaise };

    Cause.findByIdAndUpdate(req.params.id, newCauseData, (err, oldRecord) => {
      if (err) {
        res.status(400).json({
          error: err
        });
      } else {
        res.status(202).json(oldRecord);
      }
    });
  });
});

// DESTROY Route
router.delete('/:id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Cause.findByIdAndRemove(req.params.id, (err, causeRecord) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(causeRecord);
    }
  });
});

module.exports = router;
