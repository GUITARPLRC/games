const express = require('express');
const router = express.Router();

const main = require('../controllers/main');

require('dotenv').config({ path: 'variables.env' });

// Main Route
router.get('/', main.homePage);

// upcoming route
router.get('/upcoming', main.upcoming);

// new release route
router.get('/newreleases', main.newReleases);

// game search route
router.get('/search', main.search);

// individual game route
router.get('/game/:id', main.game);

// individual platform route
router.get('/platform/:platform', main.platform);

// // user login
// router.get('/login', user.login);
//
// //user signup
// router.get('/signup', user.signup);

module.exports = router;
