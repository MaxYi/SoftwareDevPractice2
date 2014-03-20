
/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.render('register');
	// res.send("respond with a resource");
};

exports.register = function (req, res) {
	res.render('register');
};

exports.login = function (req, res) {
	var account = req.param('email')
		,	pwd = req.param('password');
	console.log(account,pwd);
	res.send('login');
};