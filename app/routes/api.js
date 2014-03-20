/**
 * api route
 * @author Qian Yi
 */
module.exports = function (app) {
	var dbclient = app.get('dbclient');

	var userCol = dbclient.collection('user');
	var profileCol = dbclient.collection('profile');

	var list = function(req, res){
		res.render('register');
		// res.send("respond with a resource");
	};

	app.get('/register', function (req, res) {
		// TODO db link
		// ......
		// if (true) {
		// 	res.send(token);
		// }
	  res.render('register', { title: '工程硕士网上报名注册' });
	});

	app.post('/login', function (req, res) {
		var account = req.param('email')
			,	pwd = req.param('password');

		console.log(account,pwd);
		res.send('login');
	});
};