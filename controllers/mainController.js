const h = require('../helpers');

exports.homePage = (req, res) => {
	h.getMain(function(result) {
		res.render('listGames', { data: result, title: 'Home' });
	});
};

exports.upcoming = (req, res) => {
	// date in mili to get api data
	const date = new Date().getTime();

	// first api call
	h.getUpcoming(date, function(result) {
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
			h.getList(gamesList, function(result) {
				res.render('listGames', {
					data: result,
					title: 'Upcoming Games'
				});
			});
		}
	});
};

exports.newReleases = (req, res) => {
	// date in mili for api call minus 1 day in mili
	const date = new Date().getTime() - 86400000;

	// first api call
	h.getNewReleases(date, function(result) {
		let list = [];
		let i = 0;

		while (i < result.length) {
			list.push(result[i].game);
			i++;
		}

		let noDupList = Array.from(new Set(list));
		let queryList = noDupList.join(',');

		// second api call
		h.getList(queryList, function(result) {
			res.render('listGames', {
				data: result,
				title: 'New Releases'
			});
		});
	});
};

exports.search = (req, res) => {
	const title = req.query.title.split(' ').join('+');

	// api call
	h.gameSearch(title, function(result) {
		res.render('listGames', { data: result, title: 'Search' });
	});
};

exports.game = (req, res) => {
	// get id of game clicked
	const gameId = req.params.id;

	// api call
	h.getList(gameId, function(gameResult) {
		responseData = gameResult[0];

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
			h.getList(similarList, function(result) {
				let list = [];
				let i = 0;
				do {
					if (result[i].name && result[i].cover) {
						list.push(result[i]);
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
};

exports.platform = (req, res) => {
	let date = new Date().getTime() - 86400;
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
	h.getPlatformGames(id, date, function(result) {
		let list = [];
		let i = 0;

		while (i < result.length) {
			list.push(result[i].game);
			i++;
		}

		let noDupList = Array.from(new Set(list));
		let queryList = noDupList.join(',');

		// second api call
		h.getList(queryList, function(result) {
			res.render('listGames', { data: result, title: platformId });
		});
	});
};
