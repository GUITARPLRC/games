let express = require('express');
let router = express.Router();

let unirest = require('unirest');

router.get('/', (req, res) => {
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary&order=popularity:desc`
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
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary&filter=[first_release_date][gt]=${date}&order=first_release_date:desc&limit=20`
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
	let date = new Date();
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary&filter=[first_release_date][lt]=${date}&order=first_release_date:desc&limit=20`
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

router.get('/search', (req, res) => {
	let responseData;
	let gameTitle = req.query.title.split(' ').join('+');

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=${gameTitle}&fields=name,cover,summary,id&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('search', { data: responseData, title: 'Search' });
		});
});

router.get('/:id', (req, res) => {
	let gameId = req.params.id;
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/${gameId}?fields=*`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('game', { data: responseData, title: `${req.params.id}` });
		});
});

module.exports = router;
