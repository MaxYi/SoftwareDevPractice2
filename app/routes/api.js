/**
 * api route
 * @author Qian Yi
 */
var fs = require('fs');
var officegen = require('officegen');
var mkdirp = require('mkdirp');

var docx = officegen ( 'docx' );
var xlsx = officegen ( 'xlsx' );

var uuid = require('../utils/uuid');
var _ = require('../utils/underscore');
var async = require('../utils/async');

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
					else res.redirect('login');
				}
			});
		}
		else res.redirect('login');
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

	app.post('/upload', function (req, res) {
		var account = req.cookies.account
			// file path
			,	path = './public/res/user/' + account
			,	file = path + '/' + req.files.pic.name
			// get default path
			, pic_path = req.files.pic.path;

		async.parallel([
			// rename the file of submit
			function (cb) {
				mkdirp(path, function (err) {
					if (err) console.error(err)
					else{
						fs.rename(pic_path, file, function(e) {
				      if (e) throw e;
				      fs.unlink(pic_path, function(error) {
				        if (error) throw error;
							  cb(null, true);
				      });
				    });
					}
				});
			},
			// db operation
			function (cb) {
				var obj = _.extend({account:account, pic_name:req.files.pic.name}, req.body);
				profileCol.findOne({account:account}, function (e, data) {
					if (err) console.error("db error: " + err);
					else if (!data){
						profileCol.save(obj, {safe:true}, function (err) {
							if (err) console.error("db error: " + err);
							else cb(null);
						});
					}
					else{
						var updateObj = {$set: obj};
						profileCol.update({account:account}, updateObj, function (err) {
							if (err) console.error("db error: " + err);
							else cb(null);
						});
					}
				});
			}],function (err) {
				if (err) res.send("async error: " + err);
				else res.send('<script>history.back(-1);</script>');
		});
	});
};