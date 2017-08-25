let express = require('express');
let path = require('path');

let routes = require('./routes/index');
let helpers = require('./helpers');

let bodyParser = require('body-parser');

let app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.locals.h = helpers;
	next();
});

app.use('/', routes);

app.listen(3000, () => {
	console.log('Running on port 3000');
});
