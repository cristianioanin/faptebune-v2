const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  authMethod: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    },
    avatar: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    },
    avatar: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    },
    avatar: {
      type: String
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

const User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = (newUser, callback) => {
  if (newUser.authMethod !== 'local') {
    return newUser.save(callback);
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.local.password, salt, (err, hash) => {
      newUser.local.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.isValidPassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      throw new Error(err);
    }
    callback(null, isMatch);
  });
}