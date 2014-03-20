var mongoskin = require('mongoskin'); 
var format = require('util').format;
	
// Mongo DB
var mongoClient = module.exports;

var _client;

/**
 * init database
 */
mongoClient.init = function(app) {
	if( !_client ){
		var dbcfg = app.get("dbcfg");
		dbcfg.port = dbcfg.port || 27017;
		var uri;
		if( dbcfg.user && dbcfg.passwd ){
			uri = format("mongodb://%s:%s@%s:%s/?auto_reconnect=true", dbcfg.user, dbcfg.passwd, dbcfg.host, dbcfg.port);
		}else{
			uri = format("mongodb://%s:%s/?auto_reconnect=true", dbcfg.host, dbcfg.port);
		}
		var dbopt = { database: dbcfg.db, safe: true };
		_client = mongoskin.db(uri, dbopt);
	}
	return _client; 
};

/**
 * shutdown database
 */
mongoClient.shutdown = function() {
	if( _client ){
		_client.close();
		_client = null;
	}
};