require('../config/passport-setup');

const express = require('express');
const router = express.Router();
const passport = require('passport');
const NGO = require('../models/NGO');
const { allowIfAdmin, allowNGOEditing } = require('../helpers/routesHelpers');

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
  NGO.find({}, (err, ngos) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(ngos);
    }
  });
});

// CREATE Route
router.post('/', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  const { name, logo, description, location } = req.body;
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
    const newNGO = { name, logo, location, lat, lng, description, author };

    NGO.create(newNGO, (err, ngoRecord) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(201).json(ngoRecord);
      }
    });
  });
});

// SHOW Route
router.get('/:id', (req, res) => {
  NGO.findById(req.params.id).populate('comments').exec((err, ngoRecord) => {
    if (err || ngoRecord === null) {
      res.status(400).json({
        error: err.message
      });
    } else {
      res.status(200).json(ngoRecord);
    }
  });
});

// UPDATE Route
router.put('/:id', passport.authenticate('jwt', { session: false }), allowNGOEditing, (req, res) => {

  const { name, logo, description, location } = req.body;

  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      return res.status(400).json({
        error: 'Provided address could not be matched through Geocoding API'
      });
    }

    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newNGOData = { name, logo, location, lat, lng, description };

    NGO.findByIdAndUpdate(req.params.id, newNGOData, (err, oldRecord) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(202).json(oldRecord);
      }
    });
  });
});

// DESTROY Route
router.delete('/:id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  NGO.findByIdAndRemove(req.params.id, (err, ngoRecord) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(ngoRecord);
    }
  });
});

module.exports = router;