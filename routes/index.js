let express = require('express');
let router = express.Router();

let unirest = require('unirest');

router.get('/', (req, res) => {

	let responseData;

	unirest.get(`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=*&limit=20`)
		.header("X-Mashape-Key", "LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf")
		.header("Accept", "application/json")
		.end(function (result) {
		  responseData = result.body;

			res.render('index', { data: responseData, title: 'Home' })
		});

})

router.get('/upcoming', (req, res) => {

	let date = new Date().getTime();

	let responseData;

	unirest.get(`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?filter[release_dates.date][gt]=${date}&fields=*&limit=20&offset=0&order=release_dates.date:asc:max`)
		.header("X-Mashape-Key", "LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf")
		.header("Accept", "application/json")
		.end(function (result) {
		  responseData = result.body;

			res.render('upcoming', { data: responseData, title: 'Upcoming Games' })
		});

})

router.get('/newreleases', (req, res) => {

	let date = new Date().getTime();

	let responseData;

	unirest.get(`https://igdbcom-internet-game-database-v1.p.mashape.com/games/?filter[release_dates.date][lt]=${date}&fields=*&limit=20&offset=0&order=release_dates.date:desc:min`)
		.header("X-Mashape-Key", "LuJ7CeWInTmsh2V727FmmsRAI9S1p1pYAbDjsnyd62PGDJbUQf")
		.header("Accept", "application/json")
		.end(function (result) {
		  responseData = result.body;

			res.render('newReleases', { data: responseData, title: 'New Releases' })
		});
})

module.exports = router
