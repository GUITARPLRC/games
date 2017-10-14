const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

require('dotenv').config({ path: 'variables.env' });

// Main Route
router.get('/', mainController.homePage);

// upcoming route
router.get('/upcoming', mainController.upcoming);

// new release route
router.get('/newreleases', mainController.newReleases);

// game search route
router.get('/search', mainController.search);

// individual game route
router.get('/game/:id', mainController.game);

// individual platform route
router.get('/platform/:platform', mainController.platform);

// user register get route
router.get('/register', userController.registerForm);

// user register post route
// 1. Validate registration data
// 2. Register userController
// 3. Log them in
router.post('/register', userController.validateRegister, userController.register, authController.login);

// userController log in
router.get('/login', userController.loginForm);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgot', authController.forgot);

router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', authController.confirmPasswords, catchErrors(authController.update));

module.exports = router;
