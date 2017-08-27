const express = require('express');
const router = express.Router();

const unirest = require('unirest');

const helpers = require('../helpers');

//NOTE remove if favicon is supplied
router.get('/favicon.ico', function(req, res) {
	res.status(204);
});

// Main Route
router.get('/', (req, res) => {
	let responseData;

	// api call
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

// upcoming route
router.get('/upcoming', (req, res) => {
	// date in mili to get api data
	const date = new Date().getTime();
	console.log(date);
	let responseData;

	// api call
	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/release_dates/?fields=*&order=date:asc&filter[date][gt]=${date}&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;
			console.log(responseData);

			// make list to make second call to api with ids
			let list = [];
			for (let i = 0; i < responseData.length; i++) {
				list.push(responseData[i].id);
			}
			let gamesList = list.join(',');

			let newGames;

			// second call to api for game list data
			unirest
				.get(
					`https://igdbcom-internet-game-database-v1.p.mashape.com/games/${gamesList}?fields=*`
				)
				.header(
					'X-Mashape-Key',
					'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
				)
				.header('Accept', 'application/json')
				.end(function(result) {
					newGames = result.body;
					console.log(newGames);

					res.render('listGames', {
						data: newGames,
						title: 'Upcoming Games'
					});
				});
		});
});

// new release route
router.get('/newreleases', (req, res) => {
	// date in mili for api call
	const date = new Date().getTime();
	console.log(date);
	let responseData;

	unirest
		.get(
			`https://igdbcom-internet-game-database-v1.p.mashape.com/release_dates/?fields=*&order=date:desc&filter[date][lt]=${date}&limit=20`
		)
		.header(
			'X-Mashape-Key',
			'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
		)
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;
			console.log(responseData);

			let list = [];
			for (let i = 0; i < responseData.length; i++) {
				list.push(responseData[i].id);
			}
			let gamesList = list.join(',');

			let newGames;

			unirest
				.get(
					`https://igdbcom-internet-game-database-v1.p.mashape.com/games/${gamesList}?fields=*`
				)
				.header(
					'X-Mashape-Key',
					'LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf'
				)
				.header('Accept', 'application/json')
				.end(function(result) {
					newGames = result.body;
					console.log(newGames);

					res.render('listGames', {
						data: newGames,
						title: 'New Releases'
					});
				});
		});
});

// game search route
router.get('/search', (req, res) => {
	const gameTitle = req.query.title.split(' ').join('+');
	let responseData;

	// api call
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

// individual game route
router.get('/:id', (req, res) => {
	// get id of game clicked
	const gameId = req.params.id;
	let responseData;

	// api call
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

			// make list of platform ids then send to render
			let platforms = [];
			if (responseData.release_dates) {
				if (responseData.release_dates.length > 0) {
					for (let i = 0; i < responseData.release_dates.length; i++) {
						platforms.push(responseData.release_dates[i].platform);
					}
				}
			}
			// remove duplicates from array
			let platformList = Array.from(new Set(platforms));

			// set title of game for browser info
			let title = '';
			if (responseData.name) {
				title = responseData.name;
			} else {
				title = 'Game';
			}

			let similarList = '';

			if (responseData.games) {
				// convert to string to include in api call
				similarList = responseData.games.join(',');

				// second api call to get similar games data
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
