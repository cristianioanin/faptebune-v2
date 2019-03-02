require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Initialize App
const app = express();

// Initialize DataBase Connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true
}, () => {
  console.log('Connected to MongoDB');
});
const db = mongoose.connection;

// BodyParser Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Init Passport
app.use(passport.initialize());

// Routes
const ngosRoutes = require('./routes/ngos');
const causesRoutes = require('./routes/causes');
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const commentsNGORoutes = require('./routes/comments-ngos');
const commentsCauseRoutes = require('./routes/comments-causes');
const donationsRoutes = require('./routes/donations');
const donationsNGORoutes = require('./routes/donations-ngos');
const donationsCauseRoutes = require('./routes/donations-causes');

app.use('/ngos', ngosRoutes);
app.use('/causes', causesRoutes);
app.use('/users', usersRoutes);
app.use('/comments', commentsRoutes);
app.use('/donations', donationsRoutes);
app.use('/ngos/:id/comments', commentsNGORoutes);
app.use('/causes/:id/comments', commentsCauseRoutes);
app.use('/ngos/:id/donations', donationsNGORoutes);
app.use('/causes/:id/donations', donationsCauseRoutes);

module.exports = app;