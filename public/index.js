$('#modal').on('show.bs.modal', e => {
	let el = $(event.target); // div that triggered modal to show
	let src = '';
	el[0].localName === 'img' ? (src = el[0].src) : (src = el[0].children[0].src);
	let newSrc = src.replace(/thumb/i, 'screenshot_big');
	$('#modalImage').attr('src', newSrc);
});
