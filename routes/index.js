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
	unirest
		.get(
			`https://api-2445582011268.apicast.io/games/?fields=name,cover,summary,id,esrb&order=popularity:desc`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			res.render('listGames', { data: result.body, title: 'Home' });
		});
});

// upcoming route
router.get('/upcoming', (req, res) => {
	// date in mili to get api data
	const date = new Date().getTime();
	let responseData;

	// api call
	unirest
		.get(
			`https://api-2445582011268.apicast.io/release_dates/?fields=*&order=date:asc&filter[date][gt]=${date}&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			// make list to make second call to api with ids
			let list = [];
			let i = 0;
			while (i < 20) {
				list.push(result.body[i].game);
				i++;
			}
			let noDupList = Array.from(new Set(list));
			let gamesList = noDupList.join(',');

			// second call to api for game list data
			if (gamesList.length > 1) {
				unirest
					.get(
						`https://api-2445582011268.apicast.io/games/${gamesList}?fields=*`
					)
					.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
					.header('Accept', 'application/json')
					.end(function(result) {
						res.render('listGames', {
							data: result.body,
							title: 'Upcoming Games'
						});
					});
			}
		});
});

// new release route
router.get('/newreleases', (req, res) => {
	// date in mili for api call
	const date = new Date().getTime() - 500000000;

	unirest
		.get(
			`https://api-2445582011268.apicast.io/release_dates/?fields=*&order=date:desc&filter[date][lt]=${date}&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(gameList) {
			let list = [];
			for (let i = 0; i < gameList.body.length; i++) {
				list.push(gameList.body[i].game);
			}
			let noDupList = Array.from(new Set(list));
			let queryList = noDupList.join(',');

			unirest
				.get(`https://api-2445582011268.apicast.io/games/${queryList}?fields=*`)
				.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
				.header('Accept', 'application/json')
				.end(function(results) {
					res.render('listGames', {
						data: results.body,
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
			`https://api-2445582011268.apicast.io/games/?search=${gameTitle}&fields=name,cover,summary,id,esrb&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body;

			res.render('listGames', { data: responseData, title: 'Search' });
		});
});

// individual game route
router.get('/game/:id', (req, res) => {
	// get id of game clicked
	const gameId = req.params.id;

	// api call
	unirest
		.get(`https://api-2445582011268.apicast.io/games/${gameId}?fields=*`)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			responseData = result.body[0];

			// make list of platform ids then send to render
			let platforms = [];
			if (responseData.release_dates) {
				if (responseData.release_dates.length > 0) {
					for (let i = 0; i < responseData.release_dates.length; i++) {
						platforms.push(responseData.release_dates[i]);
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
						`https://api-2445582011268.apicast.io/games/${similarList}?fields=*`
					)
					.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
					.header('Accept', 'application/json')
					.end(function(result) {
						let list = [];
						let i = 0;
						do {
							if (result.body[i].name && result.body[i].cover) {
								list.push(result.body[i]);
							}
							i++;
						} while (list.length < 5 && i < 10);

						res.render('game', {
							data: responseData,
							title: responseData.name,
							games: list,
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

// individual platform route
router.get('/platform/:platform', (req, res) => {
	let date = new Date().getTime() - 50000000;
	// get id of game clicked
	const platformId = req.params.platform;
	let id;
	if (platformId == 'playstation') {
		id = 48;
	} else if (platformId == 'xbox') {
		id = 49;
	} else if (platformId == 'nintendo') {
		id = 130;
	} else {
		res.end();
	}

	// api call
	unirest
		.get(`https://api-2445582011268.apicast.io/games/${Id}?fields=*`)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {

			res.render('platform', data: )
		})
});
module.exports = router;
