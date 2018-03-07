var SSJS = {REVISION: '1'};
module.exports = SSJS;

var path = require('path');


var util = require('util');
function dump(o) {
	return util.inspect(o, {showHidden: true, depth: null});
}

//var INCLUDE_PATH = './includes';

var SERVER_PATH = path.resolve('../server');
var backend = require(path.resolve(SERVER_PATH + '/backend.js'));


SSJS.serve = function(server, req) {
//		<pre>backend.CACHE = ' + dump(backend.CACHE) + '</pre>
//		<pre>global.BACKEND_CACHE = ' + dump(global.BACKEND_CACHE) + '</pre>

	return '\
<html>\
	<head>\
		<title>Server Control</title>\
	</head>\
	<body>\
		<h1>This is control.ssjs</h1>\
'+
/*
		<h3>shopInfo</h3>\
		<pre>' + dump(req.shopInfo) + '</pre>\
		\
*/'\
		counter=' + req.session.counter+ '\
		<hr />\
		<a href="/client/index.sstpl">Client</a>\
		|\
		<a href="/resetSession" target="_new">Reset Session</a>\
		|\
		<a href="/quit" target="_new">Stop Server</a>\
		\
		<pre>url = "' + (req.url) + '"</pre>\
		\
		<h3>Session</h3>\
		<pre>' + dump(req.session) + '</pre>\
		\
	</body>\
</html>';
}
