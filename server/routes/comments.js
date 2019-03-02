require('../config/passport-setup');

const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const Comment = require('../models/Comment');
const { allowIfAdmin } = require('../helpers/routesHelpers');

// INDEX Route
router.get('/', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(comments);
    }
  });
});

// SHOW Route
router.get('/:id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(comment);
    }
  });
});

// UPDATE Route
router.put('/:id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body.comment, (err, oldComment) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(oldComment);
    }
  });
});

// DELETE Route
router.delete('/:id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Comment.findByIdAndRemove(req.params.id, (err, comment) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(comment);
    }
  });
});

module.exports = router;