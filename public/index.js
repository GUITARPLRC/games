$('#modal').on('show.bs.modal', e => {
	let el = $(event.target); // div that triggered modal to show
	let src = '';

	el[0].localName === 'img' ? (src = el[0].src) : (src = el[0].children[0].src); // local name either img or div

	let newSrc = src.replace(/thumb/, 'screenshot_big');

	$('#modalContainer').attr('src', newSrc);
});
