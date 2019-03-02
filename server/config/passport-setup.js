require('dotenv').config();

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/User');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
  User.findOne({ _id: payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ 'google.id': profile.id }, (err, userRecord) => {
    if (err) {
      return done(err, false, err.message);
    }
    if (userRecord) {
      return done(null, userRecord);
    }
    const newUser = new User({
      authMethod: 'google',
      google: {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails.length ? profile.emails[0].value : '',
        avatar: profile.photos.length ? profile.photos[0].value : ''
      }
    });
    User.createUser(newUser, (err, user) => {
      if (err) {
        done(err, false, err.message);
      } else {
        done(null, user);
      }
    });
  });
}));

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ 'facebook.id': profile.id }, (err, userRecord) => {
    if (err) {
      return done(err, false, err.message);
    }
    if (userRecord) {
      return done(null, userRecord);
    }
    const newUser = new User({
      authMethod: 'facebook',
      facebook: {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails.length ? profile.emails[0].value : '',
        avatar: profile.photos.length ? profile.photos[0].value : ''
      }
    });
    User.createUser(newUser, (err, user) => {
      if (err) {
        done(err, false, err.message);
      } else {
        done(null, user);
      }
    });
  });
}));

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  User.findOne({ 'local.email': email }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      User.isValidPassword(password, user.local.password, (err, isMatch) => {
        if (err) {
          throw new Error(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    } else {
      return done(null, false);
    }
  });
}));