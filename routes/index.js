let express = require('express');
let router = express.Router();

let unirest = require('unirest');

router.get('/', (req, res) => {
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover&order=popularity:desc`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('index', { data: responseData, title: 'Home' });
		});
});

router.get('/upcoming', (req, res) => {
	let date = new Date();
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover&filter=[first_release_date][gte]=${date}&order=release_dates.date:desc`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('upcoming', { data: responseData, title: 'Upcoming Games' });
		});
});

router.get('/newreleases', (req, res) => {
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover&order=release_dates.date:desc:min`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('newReleases', { data: responseData, title: 'New Releases' });
		});
});

router.post('/search', (req, res) => {
	let responseData;
	let gameTitle = req.body.title.split(' ').join('+');

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=${gameTitle}&fields=name,cover&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('search', { data: responseData, title: 'New Releases' });
		});
});

module.exports = router;
