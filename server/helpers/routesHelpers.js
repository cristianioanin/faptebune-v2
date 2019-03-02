require('dotenv').config();

const JWT = require('jsonwebtoken');
const Joi = require('joi');
const NGO = require('../models/NGO');
const Cause = require('../models/Cause');
const Comment = require('../models/Comment');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }
      if (!req.value) {
        req.value = {};
      }
      req.value['body'] = result.value;
      next();
    }
  },

  schemas: {
    registrationSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      username: Joi.string().required(),
      avatar: Joi.string(),
      password: Joi.string().required(),
      passwordConfirm: Joi.string().valid(Joi.ref('password')).required().options({
        language: {
          any: {
            allowOnly: 'must match password'
          }
        }
      })
    }),
    authenticationSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  },

  signJWTToken: (user) => {
    return JWT.sign({
      iss: 'fapte-bune',
      sub: user.id,
      iat: new Date().getTime(),
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }, process.env.JWT_SECRET);
  },

  allowNGOEditing: (req, res, next) => {
    NGO.findById(req.params.id, (err, ngoRecord) => {
      if (err || ngoRecord === null) {
        res.status(400).json({
          error: err
        });
      } else {
        if (ngoRecord.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          res.status(403).json({
            error: 'You are not authorized to access extended features over this specific resource'
          });
        }
      }
    });
  },

  allowCauseEditing: (req, res, next) => {
    Cause.findById(req.params.id, (err, causeRecord) => {
      if (err || causeRecord === null) {
        res.status(400).json(err);
      } else {
        if (causeRecord.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          res.status(403).json({
            error: 'You are not authorized to access extended features over this specific resource'
          });
        }
      }
    });
  },

  allowCommentEditing: (req, res, next) => {
    Comment.findById(req.params.comment_id, (err, commentRecord) => {
      if (err || commentRecord === null) {
        res.status(400).json(err);
      } else {
        if (commentRecord.author.id.equals(req.user._id) || req.user.isAdmin) {
          next();
        } else {
          res.status(403).json({
            error: 'You are not authorized to access extended features over this specific resource'
          });
        }
      }
    });
  },

  allowIfAdmin: (req, res, next) => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        error: 'You are not authorized to access this API'
      });
    }
  }
}