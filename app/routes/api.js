/**
 * api route
 * @author Qian Yi
 */
var uuid = require('../utils/uuid');

module.exports = function (app) {

	var dbclient = app.get('dbclient');

	var userCol = dbclient.collection('user');
	var profileCol = dbclient.collection('profile');

	var list = function(req, res){
		res.render('register');
		// res.send("respond with a resource");
	};

	// GET FUNCTION
	// Just get pages in browser
	/*
	 ######   ######## ######## 
	##    ##  ##          ##    
	##        ##          ##    
	##   #### ######      ##    
	##    ##  ##          ##    
	##    ##  ##          ##    
	 ######   ########    ##  
	 */
	app.get('/register', function (req, res) {
	  res.render('register', { title: '工程硕士网上报名注册' });
	});

	app.get('/login', function (req, res) {
		res.render('login');
	});

	app.get('/admin', function (req, res) {
		var name = req.param('account')
			,	token = req.param('token');

		if (!!name && !!token){
			userCol.findOne({account:name, token:token}, function (err, data) {
				if (err) res.send("db error: " + err);
				else {
					if (!!data){
						res.render('adminPanel');
					}
					else res.render('login');
				}
			});
		}
		else res.render('login');
	});

	// post function
	// For communicate with script in pages
	/*
	########   #######   ######  ######## 
	##     ## ##     ## ##    ##    ##    
	##     ## ##     ## ##          ##    
	########  ##     ##  ######     ##    
	##        ##     ##       ##    ##    
	##        ##     ## ##    ##    ##    
	##         #######   ######     ##    
	 */
	/**
	 * check the name of account is unique
	 */
	app.post('/check', function (req, res) {
		var name = req.param('account');
		if (!!name){
			userCol.findOne({account:name}, function (err, data) {
				if (err) res.send("db error: " + err);
				else {
					if (!!data){
						res.send("This name has been registered");
					}
					else res.send(200);
				}
			});
		}
		else res.send("Info wrong");
	});

	/**
	 * for user register
	 */
	app.post('/register', function (req, res) {
		var account = req.param('account')
			,	pwd = req.param('password')
			,	email = req.param('email')
			,	tele = req.param('phonenumber');

		var user = {
				account : account
			,	password : pwd
			,	email : email
			,	phone : tele
			,	token : ""
			,	type : 0
		};

		if (!!account && !!pwd && !!email && !!tele){
			userCol.save(user, {safe:true}, function (err) {
				if (err) res.send("db error: " + err);
				else res.send(200);
			});
		}
		else res.send("Info wrong");
	});

	app.post('/login', function (req, res) {
		var name = req.param('account')
			,	pwd = req.param('password');

		var token = uuid.v4()
			,	expire = 2 * 60 * 60 * 1000  // two hours
			,	updateObj = {
				$set : {
					token : token
				}
			};

		if (!!name && !!pwd){
			userCol.findOne({account:name, password:pwd}, function (err, data) {
				if (err) res.send("db error: " + err);
				else {
					if (!!data){
						userCol.update({account:name}, updateObj, function (e) {
							if (e) res.send("db error: " + e);
							else{
								res.cookie('account', name , { maxAge: expire , signed: false });
								res.cookie('access_token', token , { maxAge: expire , signed: false });
								res.send(200);
							}
						});
					}
					else res.send("Failed");
				}
			});
		}
	});
};