require('dotenv').config();
require('../config/passport-setup');

const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

const {
  validateBody,
  schemas,
  signJWTToken,
  allowIfAdmin
} = require('../helpers/routesHelpers');

// REGISTER Route
router.post('/register', validateBody(schemas.registrationSchema), (req, res) => {
  const {
    username,
    password,
    email,
    avatar
  } = req.value.body;

  User.findOne({
    'local.email': email
  }).then(userRecord => {
    if (userRecord) {
      return res.status(403).json({
        error: 'Email is already in use'
      });
    } else {
      const newUser = new User({
        authMethod: 'local',
        local: {
          username,
          password,
          email,
          avatar
        }
      });

      User.createUser(newUser, (err, user) => {
        if (err) {
          res.status(400).json(err);
        } else {
          const token = signJWTToken(user);
          res.status(201).json({
            token
          });
        }
      });
    }
  });
});

// LOGIN Route
router.post('/login', validateBody(schemas.authenticationSchema), passport.authenticate('local', {
  session: false
}), (req, res) => {
  const token = signJWTToken(req.user);
  res.status(200).json({
    token,
    user: req.user
  });
});

// SOCIAL Login Routes
router.post('/auth/google', passport.authenticate('googleToken', {
  session: false
}), (req, res) => {
  const token = signJWTToken(req.user);
  res.status(200).json({
    token
  });
});

router.post('/auth/facebook', passport.authenticate('facebookToken', {
  session: false
}), (req, res) => {
  const token = signJWTToken(req.user);
  res.status(200).json({
    token
  });
});

// INDEX Route
router.get('/', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(users);
    }
  });
});

// Token Validation Route
router.post('/validate', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  const token = signJWTToken(req.user);
  res.status(200).json({
    token,
    user: req.user
  });
});

// SHOW Route
router.get('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {

  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(200).json(user);
    }
  });
});

// UPDATE Route
router.put('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  const {
    username,
    email,
    avatar
  } = req.body;

  User.findById(req.params.id, (err, userRecord) => {
    const authMethod = userRecord.authMethod;
    User.findByIdAndUpdate(req.params.id, {
      [authMethod]: {
        username,
        email,
        avatar
      }
    }, (err, oldRecord) => {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(oldRecord);
      }
    });
  });
});

// DELETE Route
router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), allowIfAdmin, (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.status(202).json(user);
    }
  });
});

router.post('/logout', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  console.log(req.headers.authorization);
  res.status(200).json({
    success: 'User logout, redirect to login page'
  });
});

module.exports = router;