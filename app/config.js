/**
 * @author Qian Yi
 */

var express = require('express');
var path = require('path');
var ejs = require('ejs');

function commonConfig (app) {
	// db configuration
	var dbcfg = {
			host: "127.0.0.1"
		,	port: "27017"
		,	db: "sdp2"
	};

	app.set('dbcfg', dbcfg);

	var mongo = require('./utils/mongo');
	var dbclient = mongo.init(app);

	// set db
	app.set('dbclient', dbclient);

	// ensure index
	dbclient.collection('user')
	.ensureIndex({account: 1}, {unique: true, dropdups: true, safe: true }, function (err) {
		if (err) console.error('ensureIndex error:' + err && err.stack);
	});

	dbclient.collection('profile')
	.ensureIndex({account: 1}, {unique: true, dropdups: true, safe: true }, function (err) {
		if (err) console.error('ensureIndex error:' + err && err.stack);
	});

	app.use(express.favicon( __dirname + '/public/img/favicon.png'));

	process.on('exit', function () {
		// shut down mongo client
		mongo.shutdown();
	});
}

/**
 * Application Configuration
 */
exports.appConfig = function (app) {
	// common config
	commonConfig(app);

	// all environments
	app.set('port', process.env.PORT || 80);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'html');

	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());

	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.methodOverride());
	app.use(express.cookieParser('signed'));
	// app router
	app.use(app.router);
	// http请求的改写
	app.engine('html', ejs.renderFile);
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	}
};