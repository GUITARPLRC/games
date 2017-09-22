const express = require('express');
const router = express.Router();

const unirest = require('unirest');

const helpers = require('../helpers');

// Main Route
router.get('/', (req, res) => {
	helpers.getMain(function(result) {
		res.render('listGames', { data: result, title: 'Home' });
	});
});

// upcoming route
router.get('/upcoming', (req, res) => {
	// date in mili to get api data
	const date = new Date().getTime();

	// first api call
	helpers.getUpcoming(date, function(result) {
		// make list to make second call to api with ids
		let list = [];
		let i = 0;
		while (i < result.length) {
			list.push(result[i].game);
			i++;
		}

		let noDupList = Array.from(new Set(list));
		let gamesList = noDupList.join(',');

		// second api call
		if (gamesList.length > 1) {
			helpers.getList(gamesList, function(result) {
				res.render('listGames', {
					data: result,
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

	// first api call
	helpers.getNewReleases(date, function(result) {
		let list = [];
		let i = 0;

		while (i < result.length) {
			list.push(result[i].game);
			i++;
		}

		let noDupList = Array.from(new Set(list));
		let queryList = noDupList.join(',');

		// second api call
		helpers.getList(queryList, function(result) {
			res.render('listGames', {
				data: result,
				title: 'New Releases'
			});
		});
	});
});

// game search route
router.get('/search', (req, res) => {
	const title = req.query.title.split(' ').join('+');

	// api call
	helpers.gameSearch(title, function(result) {
		res.render('listGames', { data: result, title: 'Search' });
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
					.get(`https://api-2445582011268.apicast.io/games/${similarList}?fields=*`)
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

						if (responseData.videos) {
							let videos = responseData.videos.slice(0, 9);
							let videoList = [];
							let i = 0;
							while (i < videos.length) {
								videoList.push(videos[i].video_id);
								i++;
							}
							res.render('game', {
								data: responseData,
								title: responseData.name,
								games: list,
								platforms: platformList,
								videos: videoList
							});
						} else {
							res.render('game', {
								data: responseData,
								title: responseData.name,
								games: list,
								platforms: platformList
							});
						}
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
	let platformId = req.params.platform;
	let id;
	if (platformId == 'playstation') {
		platformId = 'Playstation 4';
		id = 48;
	} else if (platformId == 'xbox') {
		platformId = 'Xbox One';
		id = 49;
	} else if (platformId == 'nintendo') {
		platformId = 'Nintendo Switch';
		id = 130;
	} else {
		res.end();
	}

	// first api call
	helpers.getPlatformGames(id, date, function(result) {
		let list = [];
		let i = 0;

		while (i < result.length) {
			list.push(result[i].game);
			i++;
		}

		let noDupList = Array.from(new Set(list));
		let queryList = noDupList.join(',');

		// second api call
		helpers.getList(queryList, function(result) {
			res.render('platform', { data: result, title: platformId });
		});
	});
});

module.exports = router;
