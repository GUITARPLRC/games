exports.siteName = 'Game Search';

exports.short = str => {
	let newStr = str.split(' ');

	if (newStr.length > 75) {
		return newStr.slice(0, 75).join(' ') + '...';
	} else {
		return str;
	}
};

exports.dateFormat = str => {
	let newStr = str.slice(5);
	newStr += `-${str.slice(0, 4)}`;
	return newStr;
};
