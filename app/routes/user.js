
/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.render('register');
	// res.send("respond with a resource");
};
exports.register = function(req, res){
	// TODO db link
	// ......
	// if (true) {
	// 	res.send(token);
	// }
  res.render('signUp', { title: '工程硕士网上报名注册' });
};