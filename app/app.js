/**
 * @author Qian Yi
 */
var express = require('express')
	,	conf = require('./config');

var app = module.exports = express();

// load configuration
conf.appConfig(app);
// start server listener
app.listen(app.get('port'));

require('./routes')(app);

process.on('uncaughtException',function(err){
	// log
	console.error("There is an uncaughtException");
	console.trace(err);
});