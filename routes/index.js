const express = require('express');
const router = express.Router();

const unirest = require('unirest');

//NOTE remove if favicon is supplied
router.get('/favicon.ico', function(req, res) {
	res.status(204);
});

router.get('/', (req, res) => {
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary,id,esrb&order=popularity:desc`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('listGames', { data: responseData, title: 'Home' });
		});
});

router.get('/upcoming', (req, res) => {
	const date = new Date();
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary,id&filter=[first_release_date][gt]=${date}&order=first_release_date:desc&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('listGames', { data: responseData, title: 'Upcoming Games' });
		});
});

router.get('/newreleases', (req, res) => {
	const date = new Date();
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,cover,summary,id,esrb&filter=[first_release_date][lt]=${date}&order=first_release_date:desc&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('listGames', { data: responseData, title: 'New Releases' });
		});
});

router.get('/search', (req, res) => {
	const gameTitle = req.query.title.split(' ').join('+');
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?search=${gameTitle}&fields=name,cover,summary,id,esrb&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('listGames', { data: responseData, title: 'Search' });
		});
});

router.get('/:id', (req, res) => {
	const gameId = req.params.id;
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
			responseData = result.body[0];

			let platforms = [];
			if (responseData.release_dates.length > 0) {
				for (let i = 0; i < responseData.release_dates.length; i++) {
					platforms.push(responseData.release_dates[i].platform);
				}
			}

			let platformList = Array.from(new Set(platforms));

			let title = '';
			if (responseData.name) {
				title = responseData.name;
			} else {
				title = 'Game';
			}

			let similarList = '';

			if (responseData.games) {
				similarList = responseData.games.join(',');

				unirest
					.get(
						`https://igdbcom-internet-game-database-v1.p.mashape.com/games/${similarList}?fields=*`
					)
					.header(
						'X-Mashape-Key',
						'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
					)
					.header('Accept', 'application/json')
					.end(function(result) {
						gamesData = result.body;

						res.render('game', {
							data: responseData,
							title: responseData.name,
							games: gamesData,
							platforms: platformList
						});
					});
			} else {
				res.render('game', {
					data: responseData,
					title: responseData.name,
					platforms: platformList
				});
			}
		});
});

module.exports = router;
