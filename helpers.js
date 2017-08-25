exports.siteName = 'Game Search';

exports.short = str => {
	let newStr = str.split(' ');

	if (newStr.length > 100) {
		return newStr.slice(0, 100).join(' ') + '...';
	} else {
		return str;
	}
};

exports.dateFormat = str => {
	let newStr = str.slice(5);
	newStr += `-${str.slice(0, 4)}`;
	return newStr;
};
