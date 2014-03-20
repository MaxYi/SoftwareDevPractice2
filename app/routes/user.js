
/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.render('register');
	// res.send("respond with a resource");
};

exports.login = function (req, res) {
	var account = req.param('email')
		,	pwd = req.param('password');
	console.log(account,pwd);
	res.send('login');
};

exports.register = function(req, res){
	// TODO db link
	// ......
	// if (true) {
	// 	res.send(token);
	// }
  res.render('register', { title: '工程硕士网上报名注册' });
};