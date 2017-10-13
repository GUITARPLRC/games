const passport = require('passport');

exports.login = passport.authenticate('local', {
	successRedirect: '/',
	successFlash: 'You are now logged in!',
	failureRedirect: '/login',
	failureFlash: 'Either your email or password are incorrect! Please try again!'
});

exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'You are now logged out!');
	res.redirect('/');
};
