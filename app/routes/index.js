/**
 * main routes
 * @author Qian Yi
 */
module.exports = function (app) {
	// main page
	app.get('/', function (req, res) {
	  res.render('index', { title: '工程硕士网上报名信息系统' });
	});

	// api route
	require('./api')(app);

	// the 500 & 404
	app.all('/*', function (req, res) {
		res.json({code:404, msg: 'Not Found'});
	});

	// setup the errors
	app.use(function (err, req, res, next) {
		var errstr = err ? err.toString() : "Unknown Error";
		if (req.uid)
			console.error("User [" + req.uid + "] " + errstr);
		res.json({code:500, msg: errstr});
	});
};