/**
 * api route
 * @author Qian Yi
 */
var fs = require('fs');
var officegen = require('officegen');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

var ACCOUNT_TYPE = {
		visitor : 0
	,	student : 1
	,	fysz : 2
	,	ysz : 3
};

var docx = officegen ({
    'type': 'docx',
    'onend': function( size ){
      console.log('Finish to create a doc file of ' + size + ' bytes.');
    },
    'onerr': function( err ){
      console.log(err);
    }
});
var xlsx = officegen ({
    'type': 'xlsx',
    'onend': function( size ){
      console.log('Finish to create a excel file of ' + size + ' bytes.');
    },
    'onerr': function( err ){
      console.log(err);
    }
});

var uuid = require('../utils/uuid');
var _ = require('../utils/underscore');
var async = require('../utils/async');

var _token = [];

module.exports = function (app) {

	var dbclient = app.get('dbclient');

	var userCol = dbclient.collection('user');
	var profileCol = dbclient.collection('profile');
	var tempCol = dbclient.collection('temp');

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

		//   test officegen
		// var out = fs.createWriteStream ('out.doc');
		// var pObj = docx.createP();
		// pObj.addText ( 'Simple' );
		// docx.generate(out);
		// fs.rename("./out.doc", './public/res/user/'+name+'/out.doc', function(e) {
		// 	if (e) throw e;
		// });

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

	// download enroll files
	app.get('/download/file', function (req,res) {
		var name = req.param('account')
			,	token = req.param('token')
			,	fileId = req.param('id');

		userCol.findOne({account:name,token:token}, function (err, data) {
			if (err) res.send("db error: " + err);
			else {
				if (!!data){
					if (fileId === "origin"){
						res.download('./public/res/origin/表1-1.doc');
					}
					else res.download('./public/res/user/'+name+'/out.doc');
				}
				else res.send("alert(cookie已过期，请重新登陆)");
			}
		});
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
								// configure type
								var type = ensureAccountType(name);
								res.cookie('type', type , { maxAge: expire , signed: false });
								if (type === 2) {
									res.cookie('position', "zb" , { maxAge: expire , signed: false });
								}
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

		async.waterfall([
			// rename the file of submit
			function (cb) {
				mkdirp(path, function (err) {
					if (err) console.error(err)
					else{
						fs.rename(pic_path, file, function(e) {
				      if (e) throw e;
				      else cb(null);
				    });
					}
				});
			},
			// db operation
			function (cb) {
				var o = {
					account: account,
					pic_name: req.files.pic.name
				};
				var obj = _.extend(o, req.body);

				profileCol.findOne({account:account}, function (e, data) {
					if (e) console.error("db error: " + e);
					else if (!data){
						profileCol.save(obj, {safe:true}, function (err) {
							if (err) console.error("db error: " + err);
							else cb(null, obj);
						});
					}
					else{
						var updateObj = {$set: obj};
						profileCol.update({account:account}, updateObj, function (err) {
							if (err) console.error("db error: " + err);
							else cb(null, obj);
						});
					}
				});
			},
			// make txt
			function (obj, cb) {
				userCol.findOne({account:account}, {_id: 0}, function (err, data) {
					var json_data = _.extend(data, obj);
					json_data = JSON.stringify(json_data);
					fs.writeFileSync(__dirname+'/../public/res/temp.json', json_data);
					cb(null);
				})
			},
			// fill doc
			function (cb) {
				// for windows
				var execPy = exec('python '+__dirname+'/../utils/word.py' ,function (err, out, stderror){
			    if(err) console.error("run python wrong: " + err);
			    else{
			    	fs.unlinkSync(__dirname+'/../public/res/temp.json');
			    	cb(null);
			    }
			  });
			}],
			function (err) {
				if (err) res.send("async error: " + err);
				else res.send('<script>history.back(-1);</script>');
		});
	});

	app.post('/uploadDoc', function (req, res) {
		var account = req.cookies.account
			// file path
			,	path = './public/res/generated/' + '2009_spring/enroll_docs'
			,	file = path + '/' + req.files.doc.name
			// get default path
			, pic_path = req.files.doc.path;

		async.parallel([
			// rename the file of submit
			function (cb) {
				mkdirp(path, function (err) {
					if (err) console.error(err)
					else{
						fs.rename(pic_path, file, function(e) {
				      if (e) throw e;
				      else cb(null);
				    });
					}
				});
			},
			// db operation
			function (cb) {
				var obj = {
					account: account,
					doc_name: req.files.pic.name,
					isUploaded: true
				};
				var updateObj = {$set: obj};
				profileCol.update({account:account}, updateObj, function (err) {
					if (err) console.error("db error: " + err);
					else cb(null);
				});
			}],
			function (err) {
				if (err) res.send("async error: " + err);
				else res.send('<script>history.back(-1);</script>');
		});
	});

	app.post('/info', function (req, res) {
		var name = req.param('account')
			,	token = req.param('token');

		userCol.findOne({account:name, token:token}, function (err, data) {
			if (err) res.send("db error: " + err);
			else {
				if (!!data){
					profileCol.findOne({account:name}, {_id:0}, function (err, data) {
						if (err) res.send("db error: " + err);
						else res.json(data);
					});
				}
				else {
					var sendObj = {code: 404};
					res.json(sendObj);
				}
			}
		});
	});

	app.post('/pay', function (req, res) {
		var name = req.param('account')
			,	token = req.param('token');

		userCol.findOne({account:name, token:token}, function (err, data) {
			if (err) res.send("db error: " + err);
			else {
				if (!!data){
					var updateObj = {$set: {isPaid: true}};
					profileCol.update({account:name}, updateObj, function (err, data) {
						if (err) res.send("db error: " + err);
						else res.send(200);
					});
				}
				else {
					res.send(403);
				}
			}
		});
	});

	app.post('/getQualifiedStudent', function (req, res) {
		var name = req.param('account')
			,	token = req.param('access_token');

		if (!!name && !!token){
			userCol.findOne({account:name, token:token}, function (err, data) {
				if (err) res.send("db error: " + err);
				else {
					if (!!data){
						var dbData = require(__dirname + '/../public/res/dbData.json')
							,	obj = { data: []}
							,	today = new Date()
							,	oneYear = 1000 * 60 * 60 * 24 * 365;

						dbData.data.forEach(function (ele, ind) {
							var time = new Date(ele.studyTime)
								,	tGap = today - time;

							obj.data[ind] = {
									name: ele.name
								,	id: ele.id
								, ifQualified: false
								,	position: "zb"
							};

							if (tGap >= oneYear && tGap <= oneYear*5 && ele.credit >= 160){
								obj.data[ind]['ifQualified'] = true;
							}
						});

						if (dbData.data.length === obj.data.length)
							res.json(obj);
					}
					else res.send(403);
				}
			});
		}
	});

	var ensureAccountType = function(account){
	  var accountSub = account.substring(0,2)
	  	,	type;
	  switch(accountSub)
	  {
			case "63":
			  type = ACCOUNT_TYPE.student;
			  break;
			case "21":
			  type = ACCOUNT_TYPE.fysz;
			  break;
			case "20":
			  type = ACCOUNT_TYPE.ysz;
			  break;
			default:
			  type = ACCOUNT_TYPE.visitor;
		};
	  return type;
	};
};