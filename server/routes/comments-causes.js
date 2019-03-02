require('../config/passport-setup');

const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const Cause = require('../models/Cause');
const Comment = require('../models/Comment');
const { allowCommentEditing, allowIfAdmin } = require('../helpers/routesHelpers');

// INDEX Route
router.get('/', (req, res) => {
  Cause.findById(req.params.id, 'comments').populate('comments').exec((err, causeRecord) => {
    if (err || causeRecord === null) {
      res.status(400).json(err);
    } else {
      res.status(200).json(causeRecord);
    }
  });
});

// CREATE Route
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Cause.findById(req.params.id, (err, causeRecord) => {
    if (err || !causeRecord) {
      res.status(400).json(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          res.status(400).json(err);
        } else {
          const authMethod = req.user.authMethod;
          comment.author.id = req.user._id;
          comment.author.username = req.user[authMethod].username;
          comment.save();

          causeRecord.comments.push(comment);
          causeRecord.save();

          res.status(201).json(comment);
        }
      });
    }
  });
});

// UPDATE Route
router.put('/:comment_id', passport.authenticate('jwt', { session: false }), allowCommentEditing, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, oldComment) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(oldComment);
    }
  });
});

// DESTROY Route
router.delete('/:comment_id', passport.authenticate('jwt', { session: false }), allowIfAdmin, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err, commentRecord) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(commentRecord);
    }
  });
});

module.exports = router;