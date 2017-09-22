const unirest = require('unirest');

exports.siteName = 'Game Search';

exports.getMain = cb => {
	unirest
		.get(`https://api-2445582011268.apicast.io/games/?fields=name,cover,summary,id,esrb&order=popularity:desc&limit=20`)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.getList = (gamesList, cb) => {
	unirest
		.get(`https://api-2445582011268.apicast.io/games/${gamesList}?fields=*`)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.getUpcoming = (date, cb) => {
	unirest
		.get(
			`https://api-2445582011268.apicast.io/release_dates/?fields=*&order=date:asc&filter[date][gt]=${date}&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.getNewReleases = (date, cb) => {
	unirest
		.get(
			`https://api-2445582011268.apicast.io/release_dates/?fields=*&order=date:desc&filter[date][lt]=${date}&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.gameSearch = (title, cb) => {
	unirest
		.get(`https://api-2445582011268.apicast.io/games/?search=${title}&fields=name,cover,summary,id,esrb&limit=20`)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.getPlatformGames = (id, date, cb) => {
	unirest
		.get(
			`https://api-2445582011268.apicast.io/release_dates/?fields=*&filter[platform][eq]=${id}&order=date:asc&filter[date][gt]=${date}&limit=20`
		)
		.header('user-key', 'b5664c84f8256123289cd6a44d2729e0')
		.header('Accept', 'application/json')
		.end(function(result) {
			cb(result.body);
		});
};

exports.short = str => {
	let newStr = str.split(' ');

	if (newStr.length > 75) {
		return newStr.slice(0, 75).join(' ') + '...';
	} else {
		return str;
	}
};

exports.dateFormat = str => {
	if (str.length > 4) {
		let newStr = str.slice(5);
		newStr += `-${str.slice(0, 4)}`;
		return newStr;
	} else {
		return str;
	}
};

exports.findPlatform = id => {
	for (let i = 0; i < platforms.length; i++) {
		if (platforms[i].id === id) {
			return `${platforms[i].name}`;
		}
	}
};

exports.getRegion = id => {
	for (let i = 0; i < region.length; i++) {
		if (region[i].id === id) {
			return `${region[i].name}`;
		}
	}
};

let platforms = [
	{ id: 14, name: 'Mac' },
	{ id: 19, name: 'Super Nintendo Entertainment System (SNES)' },
	{ id: 22, name: 'Game Boy Color' },
	{ id: 24, name: 'Game Boy Advance' },
	{ id: 25, name: 'Amstrad CPC' },
	{ id: 26, name: 'ZX Spectrum' },
	{ id: 29, name: 'Sega Mega Drive/Genesis' },
	{ id: 41, name: 'Wii U' },
	{ id: 44, name: 'Tapwave Zodiac' },
	{ id: 48, name: 'PlayStation 4' },
	{ id: 52, name: 'Arcade' },
	{ id: 60, name: 'Atari 7800' },
	{ id: 73, name: 'BlackBerry OS' },
	{ id: 79, name: 'Neo Geo MVS' },
	{ id: 84, name: 'SG-1000' },
	{ id: 89, name: 'Microvision' },
	{ id: 92, name: 'SteamOS' },
	{ id: 98, name: 'DEC GT40' },
	{ id: 99, name: 'Family Computer (FAMICOM)' },
	{ id: 105, name: 'HP 3000' },
	{ id: 108, name: 'PDP-11' },
	{ id: 110, name: 'PLATO' },
	{ id: 116, name: 'Acorn Archimedes' },
	{ id: 119, name: 'Neo Geo Pocket' },
	{ id: 120, name: 'Neo Geo Pocket Color' },
	{ id: 123, name: 'WonderSwan Color' },
	{ id: 126, name: 'TRS-80' },
	{ id: 129, name: 'Texas Instruments TI-99' },
	{ id: 130, name: 'Nintendo Switch' },
	{ id: 132, name: 'Amazon Fire TV' },
	{ id: 5, name: 'Wii' },
	{ id: 8, name: 'PlayStation 2' },
	{ id: 9, name: 'PlayStation 3' },
	{ id: 12, name: 'Xbox 360' },
	{ id: 21, name: 'Nintendo GameCube' },
	{ id: 30, name: 'Sega 32X' },
	{ id: 32, name: 'Sega Saturn' },
	{ id: 33, name: 'Game Boy' },
	{ id: 34, name: 'Android' },
	{ id: 42, name: 'N-Gage' },
	{ id: 59, name: 'Atari 2600' },
	{ id: 62, name: 'Atari Jaguar' },
	{ id: 65, name: 'Atari 8-bit' },
	{ id: 70, name: 'Vectrex' },
	{ id: 78, name: 'Sega CD' },
	{ id: 82, name: 'Web browser' },
	{ id: 87, name: 'Virtual Boy' },
	{ id: 88, name: 'Odyssey' },
	{ id: 94, name: 'Commodore Plus/4' },
	{ id: 96, name: 'PDP-10' },
	{ id: 100, name: 'Analogue electronics' },
	{ id: 101, name: 'Ferranti Nimrod Computer' },
	{ id: 103, name: 'PDP-7' },
	{ id: 104, name: 'HP 2100' },
	{ id: 113, name: 'OnLive Game System' },
	{ id: 117, name: 'Philips CD-i' },
	{ id: 127, name: 'Fairchild Channel F' },
	{ id: 135, name: 'Hyper Neo Geo 64' },
	{ id: 136, name: 'Neo Geo CD' },
	{ id: 4, name: 'Nintendo 64' },
	{ id: 6, name: 'PC (Microsoft Windows)' },
	{ id: 15, name: 'Commodore C64/128' },
	{ id: 20, name: 'Nintendo DS' },
	{ id: 27, name: 'MSX' },
	{ id: 35, name: 'Sega Game Gear' },
	{ id: 36, name: 'Xbox Live Arcade' },
	{ id: 38, name: 'PlayStation Portable' },
	{ id: 51, name: 'Family Computer Disk System' },
	{ id: 55, name: 'Mobile' },
	{ id: 57, name: 'WonderSwan' },
	{ id: 80, name: 'Neo Geo AES' },
	{ id: 85, name: 'Donner Model 30' },
	{ id: 93, name: 'Commodore 16' },
	{ id: 106, name: 'SDS Sigma 7' },
	{ id: 109, name: 'CDC Cyber 70' },
	{ id: 114, name: 'Amiga CD32' },
	{ id: 118, name: 'FM Towns' },
	{ id: 131, name: 'Nintendo PlayStation' },
	{ id: 134, name: 'Acorn Electron' },
	{ id: 7, name: 'PlayStation' },
	{ id: 13, name: 'PC DOS' },
	{ id: 16, name: 'Amiga' },
	{ id: 18, name: 'Nintendo Entertainment System (NES)' },
	{ id: 39, name: 'iOS' },
	{ id: 46, name: 'PlayStation Vita' },
	{ id: 49, name: 'Xbox One' },
	{ id: 66, name: 'Atari 5200' },
	{ id: 67, name: 'Intellivision' },
	{ id: 71, name: 'Commodore VIC-20' },
	{ id: 72, name: 'Ouya' },
	{ id: 77, name: 'Sharp X1' },
	{ id: 86, name: 'TurboGrafx-16/PC Engine' },
	{ id: 95, name: 'PDP-1' },
	{ id: 97, name: 'PDP-8' },
	{ id: 107, name: 'Call-A-Computer time-shared mainframe computer system' },
	{ id: 111, name: 'Imlac PDS-1' },
	{ id: 112, name: 'Microcomputer' },
	{ id: 115, name: 'Apple IIGS' },
	{ id: 47, name: 'Wii Virtual Console' },
	{ id: 3, name: 'Linux' },
	{ id: 45, name: 'PlayStation Network' },
	{ id: 37, name: 'Nintendo 3DS' },
	{ id: 64, name: 'Sega Master System' },
	{ id: 11, name: 'Xbox' },
	{ id: 23, name: 'Dreamcast' },
	{ id: 50, name: '3DO Interactive Multiplayer' },
	{ id: 53, name: 'MSX2' },
	{ id: 56, name: 'WiiWare' },
	{ id: 58, name: 'Super Famicon' },
	{ id: 61, name: 'Atari Lynx' },
	{ id: 63, name: 'Atari ST/STE' },
	{ id: 68, name: 'ColecoVision' },
	{ id: 69, name: 'BBC Microcomputer System' },
	{ id: 74, name: 'Windows Phone' },
	{ id: 90, name: 'Commodore PET' },
	{ id: 91, name: 'Bally Astrocade' },
	{ id: 102, name: 'EDSAC' },
	{ id: 121, name: 'Sharp X68000' },
	{ id: 122, name: 'Nuon' },
	{ id: 124, name: 'SwanCrystal' },
	{ id: 125, name: 'PC-8801' },
	{ id: 128, name: 'PC Engine SuperGrafx' },
	{ id: 133, name: 'Philips Videopac G7000' }
];

let region = [
	{ id: 1, name: 'EU' },
	{ id: 2, name: 'NA' },
	{ id: 3, name: 'AU' },
	{ id: 4, name: 'NZ' },
	{ id: 5, name: 'JP' },
	{ id: 6, name: 'CH' },
	{ id: 7, name: 'AS' },
	{ id: 8, name: 'Worldwide' }
];
