// Libraries
var util = require('util');
var fs = require('fs');
var path = require('path');	// For sanitizing paths
var http = require('http');	// For http server

var connect = require('connect');
var cookieSession = require('cookie-session');	// cookie-session middleware
var serveStatic = require('serve-static');	// serve-static middleware

//var inspect = require('util').inspect;
var Busboy = require('busboy');

var express = require('express');
var mongoose = require('mongoose');

// ATHENTICATION
var passport	= require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./models/user'); // get the mongoose model
var Action        = require('./models/action'); // get the mongoose model
var Tables        = require('./models/tables'); // get the mongoose model
var Extra        = require('./models/extra'); // get the mongoose model
var jwt         = require('jwt-simple');

var url = require('url');
var PARSE_ODS = require('./parseOds');

var fse = require('fs-extra');
var jsonfile = require('jsonfile');

// Globals
var SERVER = {REVISION: '1'};
global.SERVER = SERVER;
module.exports = SERVER;

MAX_DATA_SIZE = 1024*1024*128;

SERVER.PRODUCTION = false;
SERVER.SERVER_PORT = 8000;
SERVER.LOG = true;
SERVER.LOG_READY = false;
SERVER.SUPPRESS_TEMPLATE_ERRORS = SERVER.PRODUCTION;	// Set to "true" for production!!

SERVER.PATHS = {};
SERVER.PATHS.ROOT     = path.resolve(__dirname + '/..');
SERVER.PATHS.SERVER   = path.resolve(SERVER.PATHS.ROOT + '/server');
SERVER.PATHS.LOG      = path.resolve(SERVER.PATHS.ROOT + '/logs');
SERVER.PATHS.CACHE    = path.resolve(SERVER.PATHS.ROOT + '/cache');
SERVER.PATHS.MODULES  = path.resolve(SERVER.PATHS.SERVER + '/node_modules');
SERVER.PATHS.SHARED   = path.resolve(SERVER.PATHS.ROOT + '/shared');
SERVER.PATHS.DATA   = path.resolve(SERVER.PATHS.ROOT + '/data');
SERVER.PATHS.INCLUDES = path.resolve(SERVER.PATHS.SHARED + '/includes');
SERVER.PATHS.PARTNER   = path.resolve(SERVER.PATHS.ROOT + '/partner');

// Setup
SERVER.LANG = require(SERVER.PATHS.INCLUDES + '/lang.js');
SERVER.TEMPLATES = require(SERVER.PATHS.SERVER + '/templates.js');
SERVER.BACKEND = require(SERVER.PATHS.SERVER + '/backend.js');
//SERVER.PRODUCTS = require(SERVER.PATHS.PRODUCTS + '/products.js');
SERVER.PARSE_ODS = PARSE_ODS;

// Helpers
function nop() {}

SERVER.lang = SERVER.LANG.resolve;

function getDateString() {
	var r = '';
	
	var t = new Date();
	
	var year = t.getFullYear();
	
	var month = t.getMonth()+1;
	if (month < 10) month = "0" + month;
	
	var day = t.getDate();
	if (day < 10) day = "0" + day;
	
	
	var hours = t.getHours();
	if (hours < 10) hours = "0" + hours;
	
	var minutes = t.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	
	var seconds = t.getSeconds();
	if (seconds < 10) seconds = "0" + seconds;
	
	r += year+ '-' + month + '-' + day;
	r += ' ';
	r += hours + ':' + minutes + ':' + seconds;
	
	return r;
}
SERVER.getDateString = getDateString;


function put(txt) {
	//console.log('server.js:\t' + txt);
	//var l = getDateString() + '\tserver.js:\t' + txt;
	var l = getDateDetail() + '\t' + txt;
	
	console.log(l);
	
	if (SERVER.LOG) {
		if ((SERVER.LOG_READY) && (typeof SERVER.log === 'function')) {
			SERVER.log(l);
		} else {
			// Buffer log
		}
	}
	return txt;
}
SERVER.put = put;
SERVER.TEMPLATES.put_external = put;

function dump(o) {
	//var JSON = require('json');
	//return util.inspect(o, {showHidden: true, depth: null});
	//return util.inspect(o, {showHidden: true, depth: 3});
	return JSON.stringify(o, null, '\t');
}
SERVER.dump = dump;




function shutdown() {
	put('shutdown(): Exiting process...');
	process.exit();
}
function quit() {
	put('quit(): Shutting down...');
	setTimeout(shutdown, 1000);
}
SERVER.quit = quit;


function errorHandler(err) {
	var t = '';
	
	put('!!! errorHandler(): An error occured "' + err + '"');
	t += '!!! errorHandler(): An error occured "' + err + '"' + '\n';
	
	if (typeof err === 'object') {
		
		if (err.message) {
			put('Error message: ' + err.message);
			t += 'Error message: ' + err.message;
		}
		if (err.stack) {
			put('Stacktrace: ' + dump(err.stack));
			console.trace(err.stack);
			
			t += 'Stacktrace: ' + (err.stack) + '\n';
			t += 'Stacktrace: ' + dump(err.stack) + '\n';
			
		}
		
	} else {
		put('errorHandler():\tArgument is not an object');
		t += 'No more info evailable for this error';
	}
	
	// Write to separate file
	//var filename = LOG_FILENAME + '.exception.txt';
	var filename = path.resolve(SERVER.PATHS.LOG + '/shop_' + getDateString() + '.exception.txt');
	fs.writeFile(filename, t, function (err) {
		//if (err) throw err;	// Feedback-loop!!!
		if (err) {
			console.log('Error in server.js while writing exception "' + filename + '": "' + err + '"! Disabling file logging!');
			LOG = false;
		} else {
			put('Exception dump "' + filename + '" was created.');
		}
	});
	
	return t;
}
SERVER.errorHandler = errorHandler;
SERVER.TEMPLATES.errorHandler_external = errorHandler;

String.prototype.endsWith = function (s) {
	return this.length >= s.length && this.substr(this.length - s.length) == s;
};
String.prototype.startsWith = function (s) {
	return this.length >= s.length && this.substr(0, s.length) == s;
};

function getDateString() {
	var r = '';
	
	var t = new Date();
	var year = t.getFullYear();
	var month = t.getMonth()+1;
	if (month < 10) month = '0' + month;
	var day = t.getDate();
	if (day < 10) day = '0' + day;
	r += year+ '-' + month + '-' + day;
	
	r += '_';
	
	var hours = t.getHours();
	var minutes = t.getMinutes();
	if (minutes < 10) minutes = '0' + minutes;
	
	var seconds = t.getSeconds();
	if (seconds < 10) seconds = '0' + seconds;
	r += hours + '-' + minutes + '-' + seconds;
	
	return r;
}
SERVER.getDateString = getDateString;

function getDateDetail() {
	var r = '';
	
	var t = new Date();
	var year = t.getFullYear();
	var month = t.getMonth()+1;
	if (month < 10) month = '0' + month;
	var day = t.getDate();
	if (day < 10) day = '0' + day;
	r += year+ '-' + month + '-' + day;
	
	r += ' ';
	
	var hours = t.getHours();
	var minutes = t.getMinutes();
	if (minutes < 10) minutes = '0' + minutes;
	
	var seconds = t.getSeconds();
	if (seconds < 10) seconds = '0' + seconds;
	
	var milliseconds = t.getMilliseconds();
	if (milliseconds < 100) milliseconds = '0' + milliseconds;
	if (milliseconds < 10) milliseconds = '0' + milliseconds;
	r += hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
	
	return r;
}
SERVER.getDateDetail = getDateDetail;

function generateUnique4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
SERVER.generateUnique4 = generateUnique4;

function generateUniqueId(c) {
	//var unix = Math.round(+new Date()/1000);
	var r = getDateString();
	r += '_';
	r += generateUnique4();
	return r;
}
SERVER.generateUniqueId = generateUniqueId;


SERVER.LOG_FILENAME = path.resolve(SERVER.PATHS.LOG + '/server_' + getDateString() + '.txt');
if (SERVER.LOG) {
	// Create log file, stop file log if something goes wrong
	fs.writeFile(SERVER.LOG_FILENAME, '# ' + SERVER.LOG_FILENAME + '\n', function (err) {
		//if (err) throw err;	// Feedback-loop!!!
		if (err) {
			console.log('Error in server.js while creating log "' + SERVER.LOG_FILENAME + '": "' + err + '"! Disabling file logging!');
			SERVER.LOG = false;
			SERVER.LOG_READY = false;
		} else {
			SERVER.LOG_READY = true;
			put('Log file "' + SERVER.LOG_FILENAME + '" was created.');
		}
	});
}

function log(txt) {
	// Intended behaviour: Re-activate only if appendFile() works!
	fs.appendFile(SERVER.LOG_FILENAME, getDateDetail() + '\t' + txt + '\n', function (err) {
		//if (err) throw err;	// Feedback-loop!!!
		if (err) {
			console.log('Error in server.js:log() while writing log: "' + err + '"');
		}
	});
	
}
SERVER.log = log;



function parseCookies(cookies) {
	var list = {};
	
	cookies && (
		cookies
		.split(';')
		.forEach(
			function(cookie) {
				var parts = cookie.split('=');
				list[parts.shift().trim()] = decodeURI(parts.join('='));
			}
		)
	);
	return list;
}

// Server Logic
/*
 * Serves a static file, makes sure it exists and is public.
 */
function getFile(file) {
	//var p = path.resolve(PUBLIC_DIR + file);
	put('getFile("' + file + '")...');
	var p = path.resolve(file);
	
	// Check if inside public dir
	if (!p.startsWith(SERVER.PATHS.SHARED)) return ('<html><body>server.getFile(): Path is not shared "' + p + '" ("' + file + '")</body></html>');
	
	// Serve file
	return fs.readFileSync(p);
}
SERVER.getFile = getFile;


/*
 * This is kind of the main method in server.js: It takes care of all the dynamic content goodness
 */
function serveDynamic(req, res, next) {
	
	function serveDynamic_do(req, res) {
		//put('Request: ' + dump(req));
		
		var url = req.url.toString();
		var params = req.params || {};
		var remoteId = req.socket.remoteAddress + ':' + req.socket.remotePort;
		var o;
		
		
		// Parse request string
		function myDecode(t) {
			t = t.split('+').join(' ');
			t = decodeURIComponent(t);
			return t;
		}
		o = url.indexOf('?');
		if (o >= 0) {
			var paramStrs = url.substr(o + 1).split('&');
			for (var i = 0; i < paramStrs.length; i++) {
				var paramStr = paramStrs[i];
				var o2 = paramStr.indexOf('=');
				var key = paramStr.substr(0, o2);
				params[key] = myDecode(paramStr.substr(o2+1));
				//params[key] = decodeURI(paramStr.substr(o2+1));
			}
			url = url.substr(0, o);
		}
		req.params = params;
		//var cookies = parseCookies(req.headers.cookie);
		
		// Session
		// Check if there is a valid session...
		if (req.session.counter) {	// && (req.session.counter > 0)) {
			//put('Recurring session!');
			var counter;
			
			counter = req.session.counter || 0;
			counter++;
			req.session.counter = counter;
			
		} else {
			// A session was not found.
			// Beware! When the tool is run in an iframe on a different domain the session will NEVER be set (prohibited third-party cookie - use Privacy Badger or Safari to test)
			
			//put('Creating new session (no valid session found): ' + dump(req.session) + '!');
			// Store initial values
			req.session.counter = 1;
			req.session.id = 'S' + generateUniqueId();
			req.session.lang = 'de_DE';
			req.session.licenseId = null;
		}
		
		
		put('Request from "' + remoteId + '" to "' + url + '"');	//, params=' + dump(params));	// + ', session=' + dump(req.session));
		
		// Generate default 200/html http response
		function respond(data, mime) {
			if (mime === undefined) mime = 'text/html';
			res.writeHead(200, {
				'Content-Type': mime
			});
			res.end(data);
		}
		function respond404(html) {
			res.writeHead(404, {
				'Content-Type': 'text/html'
			});
			res.end(html);
		}
		function respond500(html) {
			res.writeHead(500, {
				'Content-Type': 'text/html'
			});
			res.end(html);
		}
		
	
		// Main handler
		
		// Check paths
		var urlRelative = url;	//.substr(ROOT_URL.length)
		//put('Relative url: "' + urlRelative + '"');
		
		var p = path.resolve(SERVER.PATHS.SHARED + urlRelative);
		// Okay, this is a valid dir.
		
		//put('Sanitized path = "' + p + '" VS "' + SERVER.PATHS.SHARED + '"');
		if (!p.startsWith(SERVER.PATHS.SHARED)) {
			respond('<html><body>server.serveDynamic(): Path is not shared "' + p + '" ("' + urlRelative + '").</body></html>');
			return;
		}
		
		
		
		
		// Serve a SSJS dynamic content
		if (p.endsWith('.ssjs')) {
			// Serve dynamic
			//put('Dynamic serve of SSJS "' + p + '"...');
			
			function runSSJS() {
				
				// Check if file exists
				if (!fs.existsSync(p)) {	// Deprecated, but working in Windows
				//if (!fs.accessSync(p)) {	// Not working in Windows
					respond404('No such SSJS.');
					return;
				}
				
				var page = require(p);
				
				page.put_external = SERVER.put_external;
				page.errorHandler_external = SERVER.errorHandler_external;
				var pageRes = page.serve(SERVER, req, res);
				if (pageRes)
					respond(pageRes);
			}
			
			
			if (SERVER.SUPPRESS_TEMPLATE_ERRORS) {
				// Suppress errors
				try {
					runSSJS();
				} catch(e) {
					respond500('Internal server error while loading SSJS "' + p + '": ' + dump(e));
				}
			} else {
				// Show errors
				runSSJS();
			}
			
			return;
			
		}
		
		// Serve a SSTPL template
		else if (
			(p.endsWith('.sstpl')) || (p.endsWith('.sscss'))
		) {
			//put('Template serve of SSTPL "' + p + '"...');
			
			if (p.endsWith('.sscss'))
				mime = 'text/css';
			else
				mime = 'text/html';
			
			function applyTemplate() {
				// Parse template file
				
				// Check if file exists
				if (!fs.existsSync(p)) {	// Deprecated, but working in Windows
				//if (!fs.accessSync(p)) {	// Not working in Windows
					respond404('No such SSTPL.');
					return;
				}
				
				var tpl = fs.readFileSync(p).toString();
				r = SERVER.TEMPLATES.applyTemplate(tpl, req, p);
				respond(r, mime);
			}
			
			
			if (SERVER.SUPPRESS_TEMPLATE_ERRORS) {
				// Suppress errors
				try {
					applyTemplate();
				} catch(e) {
					respond500('Internal server error while loading SSTPL "' + p + '": ' + dump(e));
				}
			} else {
				// Show all errors
				applyTemplate();
			}
			return;
		}
		else
		
		// Serve special pages and "rest"
		switch(url) {
			/*
			case '/':
				// Serve default page
				//var page = require(SERVER.PATHS.SHARED + '/index.ssjs');
				//respond(page(SERVER, req));
				return;
				break;
			*/
			
			case '/causeError':
				// Cause action to test exception handlers
				
				if (SERVER.PRODUCTION) {
					respond('Action "causeError" is not available in production.');
					
				} else {
					put('Throwing error...');
					var err = new Error('ExampleError_thrown_by_requesting_causeError_via_HTTP');
					throw err;
					/*
					put('Error thrown.');
					
					put('Requesting unavailable library...');
					var l = require('someLibraryNameThatShouldNotExist');
					
					put('Calling unavailable method on undefined library...');
					l.someMethodThatShouldNotExist();
					put('Method called.');
					*/
				}
				break;
			
			
			case '/resetSession':
				// Corrupt session so that it is re-initialized next time
				
				req.session = null;
				//req.shopInfo = null;
				
				//respond('Session was reset.');
				respond('Session was reset...<script>window.opener.location.reload(); window.close();</script>');
				break;
			
			
			case '/quit':
				// Stop server
				if (SERVER.PRODUCTION) {
					respond('Action "quit" is not available in production.');
				} else {
					respond('Quitting...<script>window.close();</script>');
					quit();
					return;
				}
				break;
			
			default:
				/*
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				var html = '<html><head><title>Oops&hellip;</title></head><body><h1>Out of Scope</h1><p>Sorry, the file was not found.</p></body></html>';
				res.end(html);
				break;
				*/
				
				// Let the next HTTP handler do its thing...
				next();
		}
	}
	
	
	
	
	function serveDynamic_handlePost(req, res) {
		if (req.files === undefined) req.files = {};
		if (req.params === undefined) req.params = {};
		
		// Handle POST
		if (req.method === 'POST') {
			var busboy = new Busboy({ headers: req.headers });
			busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
				console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

				var rf = {
					'name': fieldname,
					'filename': filename,
					'mime': mimetype,
					'dataBuffers': [],
					'dataSize': 0
				};
				
				file.on('data', function(data) {
					console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
					
					if (rf.dataSize > MAX_DATA_SIZE) {
						console.log('Uploaded max data size exceeded!');
						return false;
					}
					
					rf.dataBuffers.push(data);
					rf.dataSize += data.length;
				});
				
				file.on('end', function() {
					console.log('File [' + fieldname + '] finished uploading.');
					
					if (typeof Buffer.alloc === typeof undefined) {
						// Old node
						rf.data = new Buffer(rf.dataSize);
					} else {
						// Regular (new) way
						rf.data = Buffer.alloc(rf.dataSize);
					}
					var o = 0;
					for (var i in rf.dataBuffers) {
						var buf = rf.dataBuffers[i];
						for (var j = 0; j < buf.length; j++) {
							rf.data[o] = buf[j];
							o++;
						}
					}
					
					//rf.data = new Buffer(rf.dataArray, 'binary');
					delete rf.dataArray;
				});
				req.files[fieldname] = rf;
			});
			busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
				req.params[fieldname] = val;
				console.log('Field [' + fieldname + ']: value: ' + util.inspect(val));
			});
			busboy.on('finish', function() {
				//console.log('req.files: \n' + JSON.stringify(req.files, null, '\t'));
				console.log('Done handling POST data. Continuing...');
				//res.writeHead(303, { Connection: 'close', Location: '/' });
				//respond('OK!');
				serveDynamic_do(req, res);
			});
			req.pipe(busboy);
			//return;
		} else {
			serveDynamic_do(req, res);
		}
	}
	
	if (SERVER.PRODUCTION) {
		// Catch all exceptions in production mode
		try {
			//serveDynamic_internal();
			serveDynamic_handlePost(req, res);
		} catch(e) {
			put('serveDynamic() caught an exception: ' + e);
			errorHandler(e);
		}
	} else {
		// Let all exceptions breaak everything
		serveDynamic_handlePost(req, res);
	}
}



function main() {
	// main code
	put('augenglueck Server\n\
(C)opyright 2016-2017 Bernhard Slawik Digital, http://www.bernhardslawik.de\n');
	
	put('Running on platform: "' + process.platform + '"');
	
	put('Loading express...');
	var app = express();
	
	put('Starting express...');
	app.use('/public', express.static(__dirname + '/public'));  
	app.use(express.static(__dirname + '/public')); 
	
	put('express app.use...');
	// get our request parameters
	app.use(express.bodyParser());
	
	// Use the passport package in our application
	app.use(passport.initialize());
	
	put('Connecting to MongoDB...');
	//Lets connect to our database using the DB server URL.
	mongoose.connect(config.database);
	
	put('Loading passport...');
	// pass passport for configuration
	require('./config/passport')(passport);
	
	
	// REST API -------------------------------------------------------------------------------
	//TODO FIXME seperate the rest-api logic from this part of code 
	
	put('Checking for admin user...');
	//create an admin if he dont exist
	User.findOne({
		  email: 'admin@scopefordesign.de'
		}, function(err, user) {
			if (err) {
				throw err;
			} 
	 
			if (!user) {
			  console.log("Authentication failed. User not found.");

			  var newUser = new User({
				  email: 'admin@scopefordesign.de',
				  pw: 'admin',
				  firstname: 'firstname',
				  lastname: 'lastname',
				  company: 'company',
				  street: 'street',
				  zip: '12345',
				  place: 'place',
				  role: 'admin',
				  status: 'active'
			  });
			
			  newUser.save(function(err) {
			
				  if (err) {
					  console.log("Error on creating a new admin: " + err);
				  } else {
					  console.log('Successful created new admin.');	
				  }
			  });
			  
			  
			} else {
				console.log('admin is already there');
			}
		}
	);
	
	//USER# CREATE A NEW USER (ONLY THE ADMIN CAN DO THIS)
	
	put('Installing REST handlers...');
	app.post('/api/users', passport.authenticate('jwt', { session: false}), function(req, res) {
		  var token = getToken(req.headers);
		 
		  if (token) {
		
	  
		  if (!req.body.email || !req.body.pw || !req.body.role) {
			  res.json({success: false, msg: 'Bitte alle Daten angeben.'});
		  } else {
		  
		  
			  var newUser = new User({
				  email: req.body.email,
				  pw: req.body.pw,
				  firstname: req.body.firstname,
				  lastname: req.body.lastname,
				  company: req.body.company,
				  street: req.body.street,
				  zip: req.body.zip,
				  place: req.body.place,
				  role: req.body.role,
				  status: 'active',
				  tel: req.body.tel,
				  fax: req.body.fax,
				  opening: req.body.opening,
				  taxnumber: req.body.taxnumber,
				  iban: req.body.iban,
				  bic: req.body.bic,
				  cp1_firstname: req.body.cp1_firstname,
				  cp1_lastname: req.body.cp1_lastname,
				  cp1_tel: req.body.cp1_tel,
				  cp1_email: req.body.cp1_email,
				  cp2_firstname: req.body.cp2_firstname,
				  cp2_lastname: req.body.cp2_lastname,
				  cp2_tel: req.body.cp2_tel,
				  cp2_email: req.body.cp2_email
			  });
			  
			  // dont save pw to json
			  var newUserJSON = new User({
				  email: req.body.email,
				  firstname: req.body.firstname,
				  lastname: req.body.lastname,
				  company: req.body.company,
				  street: req.body.street,
				  zip: req.body.zip,
				  place: req.body.place,
				  role: req.body.role,
				  status: 'active',
				  tel: req.body.tel,
				  fax: req.body.fax,
				  opening: req.body.opening,
				  taxnumber: req.body.taxnumber,
				  iban: req.body.iban,
				  bic: req.body.bic,
				  cp1_firstname: req.body.cp1_firstname,
				  cp1_lastname: req.body.cp1_lastname,
				  cp1_tel: req.body.cp1_tel,
				  cp1_email: req.body.cp1_email,
				  cp2_firstname: req.body.cp2_firstname,
				  cp2_lastname: req.body.cp2_lastname,
				  cp2_tel: req.body.cp2_tel,
				  cp2_email: req.body.cp2_email
			  });
		
			  newUser.save(function(err) {
			
				  if (err) {
					  console.log("Error on creating a new user: " + err);
					  return res.json({success: false, msg: 'Der User existiert bereits.'});
				  } else {
					  console.log('Successful created new user.');	
					  res.json({success: true, msg: 'Der User wurde erfolgreich angelegt.'});
					  
					  var source = SERVER.PATHS.PARTNER + '/default';
					  var originalPathStart = SERVER.PATHS.PARTNER;
					  var destination = SERVER.PATHS.PARTNER + '/' + req.body.email;
					  
						
					  if(destination.substr(0, originalPathStart.length) == originalPathStart) { 
					  
					  //create a folder for this user
					  fse.copy(source, destination, function (err) {
						  if (err) return console.error(err)
						  //console.log("create order success!")
						  
						  var jfile = destination + '/user.json'
						  
						  jsonfile.writeFile(jfile, newUserJSON, function (err) {
							  if(err){
							  console.error(err)
							  } else {
								  //console.log("successfull created a new user.json");
							  }
						  });
						});

						try {
						  fs.copySync(source, destination)
						  //console.log("create order success!")
						  
						} catch (err) {
						  console.error(err)
						}
						
						} else {
							//console.log("tryed to hack the path name");
						}
				  }
			  });
			  
			  //***************************************************
			  
			  console.log('CREATE DATABASE ENTRIES IN TABLE tables FROM DEFAULT-TEMPLATE-FILE');
			  
				
				var partnerId = req.body.email;
				var defaultFilePathODS = SERVER.PATHS.PARTNER + '/default/uploads/tables.ods'
				
				var buffer = fs.readFile(defaultFilePathODS, function (err, data) {
	
						
						var odsData = data;
						
						// Parse ODS file
						SERVER.PARSE_ODS.parseOds(odsData, function(tableList) {
							
							var tables = tableList.tables;
							
							var id = "";
							
							for (var i in tables) {
								
								var jsTable = [];
								jsTable.push(tables[i]);
								
								id = tables[i].name;
								
								var tablesEntry = new Tables({
									uniqueId: partnerId + '_' + id,
									partnerId: partnerId,
									tableId: id,
									table: jsTable
								});
								
								tablesEntry.save(function(err) {
									
									if (err) {
										console.log("Error on creating a new entry in tables: " + err);
										return res.json({success: false, msg: 'Der Eintrag existiert bereits in der Tabelle.'});
									}
									console.log('Successful created new entry in tables.');	
									res.json({success: true, msg: 'Der neue Eintrag wurde erfolgreich hinzugefügt.'});
									
								});
								
							}
							
						});
						
					  
					});
			  
			  
			  //***************************************************
			  
		  }
		  
		  } else {
			  console.log("STATUS 403:  No token provided.");	  
			  return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
	});
	
	//USER# AUTHENTICATE A USER 
	app.post('/api/authenticate', function(req, res) {
		
	  console.log("POST /api/authenticate");
		
	  User.findOne({
		email: req.body.email
	  }, function(err, user) {
		if (err) throw err;
	 
		if (!user) {
		  console.log("Authentication failed. User not found.");
		  res.send({success: false, msg: 'Authentifizierung fehlgeschlagen. Diese Userdaten sind nicht gültig!'});
		} else {
		  // check if password matches
		  user.comparePassword(req.body.pw, function (err, isMatch) {
			if (isMatch && !err) {
			  // if user is found and password is right create a token
			  var token = jwt.encode(user, config.secret);
			  // return the information including token as JSON
			  console.log("Authentication was successful.");
			  res.json({success: true, token: 'JWT ' + token});
			} else {
			  console.log("Authentication failed. Wrong password.");
			  res.send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
			}
		  });
		}
	  });
	});
	
	//USER# helper for token
	getToken = function (headers) {
	  if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
		  return parted[1];
		} else {
		  return null;
		}
	  } else {
		return null;
	  }
	};
	
	//USER# GET MEMBERINFO (FIRSTNAME + LASTNAME AS A STRING)
	app.get('/api/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
		  email: decoded.email
		}, function(err, user) {
			if (err) throw err;
	 
			if (!user) {
			  //console.log("Authentication failed. User not found.");
			  return res.status(403).send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
			} else {
			  //console.log("memberinfo:  " + user.firstname + " " + user.lastname);	
			  res.json({success: true, msg: user.firstname + " " + user.lastname});
			}
		});
	  } else {
		  console.log("STATUS 403:  No token provided.");	  
		  return res.status(403).send({success: false, msg: 'No token provided.'});
	  }
	});
	
	//USER# GET STATUS
	app.get('/api/status', passport.authenticate('jwt', { session: false}), function(req, res) {
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
		  email: decoded.email
		}, function(err, user) {
			if (err) throw err;
	 
			if (!user) {
			  //console.log("Authentication failed. User not found.");
			  return res.status(403).send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
			} else {
			  //console.log("status:  " + user.status);	
			  res.json({success: true, msg: user.status});
			}
		});
	  } else {
		  console.log("STATUS 403:  No token provided.");	  
		  return res.status(403).send({success: false, msg: 'No token provided.'});
	  }
	});
	
	//USER# GET ROLE OF A USER
	app.get('/api/users/role', passport.authenticate('jwt', { session: false}), function(req, res) {
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);
		User.findOne({
		  email: decoded.email
		}, function(err, user) {
			if (err) throw err;
	 
			if (!user) {
			  //console.log("Authentication failed. User not found.");
			  return res.status(403).send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
			} else {
			  //console.log("role:  " + user.role);	
			  res.json({success: true, role: user.role});
			}
		});
	  } else {
		  console.log("STATUS 403:  No token provided.");	  
		  return res.status(403).send({success: false, msg: 'No token provided.'});
	  }
	});
	
	//USER# GET ALL USERS OF A ROLE
	app.get('/api/users/role/:role', passport.authenticate('jwt', { session: false}), function(req, res) {
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);
		
		//console.log('req.params.role: ' + req.params.role);
		
		User.find({"role": req.params.role}, function(err, users) {
			if (err) throw err;
		 
			if (!users) {
			  console.log("No users found.");			
			  return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
			} else {
			  console.log("Ok. I am fine!");	
			  res.json({success: true, users: users});
			}
		});
		
	  } else {
		  console.log("STATUS 403:  No token provided.");	  
		  return res.status(403).send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
	  }
	});
	
	//USER# GET MAIL-ADDRESS OF AN AUTHENTICATED USER
	app.get('/api/users/id', passport.authenticate('jwt', { session: false}), function(req, res) {
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);
		
		User.findOne({
		  email: decoded.email
		}, function(err, user) {
			if (err) throw err;
	 
			if (!user) {
			  console.log("Authentication failed. User not found.");
			  return res.status(403).send({success: false, msg: 'Authentifizierung fehlgeschlagen.'});
			} else {
			  console.log("userid:  " + user.email);	
			  res.json({success: true, msg: user.email});
			}
		});
	  } else {
		  console.log("STATUS 403:  No token provided.");	  
		  return res.status(403).send({success: false, msg: 'No token provided.'});
	  }
	});
	
	//ACTION# UPDATE THE STATUS OF A USER
	app.put('/api/users/status', passport.authenticate('jwt', { session: false}),function(req, res) {

		console.log('/api/users/status');
		
		var token = getToken(req.headers);
		  if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			var status = req.body.status;
			var partnerId = req.body.email;
			
			//console.log(status + " " + partnerId);
		
			User.findOne({ 'email': partnerId }, function(err, user) {

				if (err) {
						res.send(err);
				} else {
				
					if(status === "active"){
						user.status = "inactive";
					}else {
						user.status = "active";
					}

					// save the new status of the user
					user.save(function(err) {
						if (err)
							res.send(err);

						res.json({ message: 'Der neue Status ist: ' +  user.status, status: user.status});
					});
				}
			});
		
		  }else {
				console.log("STATUS 403:  No token provided.");	  
				return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
		
	});
	
	//ACTION# CREATE A NEW ACTION 
	app.post('/api/actions', passport.authenticate('jwt', { session: false}), function(req, res) {
		
	  var token = getToken(req.headers);
	  if (token) {
		var decoded = jwt.decode(token, config.secret);	
		
		//to identify if the admin has created the action or a single user
		var creator = decoded.email;
		
		var isInputOk = false;
		
		var filepath = '';
		
		console.log();
		
		if(req.body.filepath != "not"){
			filepath = SERVER.PATHS.PARTNER + '/' + req.body.email+ '/uploads/' + req.body.filepath;
		}
		
		//must-have-fields
		//if (!req.body.type || !req.body.title || !req.body.start || !req.body.end || !req.body.email || !req.body.id) {
		if (!req.body.title || !req.body.start || !req.body.end || !req.body.email || !req.body.id) {
			console.log(JSON.stringify(req.body, null, '\t'));
			return res.json({success: false, msg: 'Bitte alle benötigten Daten angeben.'});
		}
		
		console.log('req.body: ' + JSON.stringify(req.body));
		
		var action = new Action({
			enabled: req.body.enabled,
			id: req.body.id,
			type: req.body.type,
			title: req.body.title,
			start: req.body.start,
			end: req.body.end,
			allDay: req.body.allDay,
			email: req.body.email,
			color: req.body.color,
			fields: req.body.fields,
			filepath: filepath,
			createdBy: creator
		});
		
		action.save(function(err) {
			if (err) {
				console.log("Error on creating a new action: " + err);
				return res.json({success: false, msg: 'Fehler beim Erstellen der Aktion: ' + err});
			} else {
				console.log('Successful created new action.');	
				res.json({success: true, msg: 'Die Aktion wurde erfolgreich angelegt.'});
			}
		});
	  
	} else {
		console.log("STATUS 403:  No token provided.");	  
		return res.status(403).send({success: false, msg: 'No token provided.'});
	  }
	});
	
	//ACTION# GET ALL ACTIONS FOR A LOGGEDIN USER
	app.get('/api/actions', passport.authenticate('jwt', { session: false}), function(req, res) {
		  var token = getToken(req.headers);
		  if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			console.log(decoded.email);
			
			Action.find({"email": decoded.email}, function(err, actions) {
				if (err) throw err;
			 
				if (!actions) {
				  console.log("No actions found.");			
				  return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
				} else {
				  console.log("Ok. I am fine!");	
				  res.json({success: true, actions: actions});
				}
			});

		  }else {
				console.log("STATUS 403:  No token provided.");	  
				return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
		});
	
	//ACTION# GET ALL ACTIONS FOR A USER BY EMAIL
	app.get('/api/actions/user/:email', passport.authenticate('jwt', { session: false}), function(req, res) {
		  var token = getToken(req.headers);
		  if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			console.log(req.params.email);
			
			Action.find({"email": req.params.email}, function(err, actions) {
				if (err) throw err;
			 
				if (!actions) {
				  console.log("No actions found.");			
				  return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
				} else {
				  console.log("Ok. I am fine!");	
				  res.json({success: true, actions: actions});
				}
			});

		  }else {
				console.log("STATUS 403:  No token provided.");	  
				return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
		});
	
	//ACTION# GET ALL ACTIONS
	app.get('/api/allactions', passport.authenticate('jwt', { session: false}), function(req, res) {
		var token = getToken(req.headers);
		if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			console.log(decoded.email);
			
			Action.find(function(err, actions) {
				if (err) throw err;
				
				if (!actions) {
					console.log("No actions found.");
					return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
				} else {
					console.log("Ok. I am fine!");
					res.json({success: true, actions: actions});
				}
			});
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	//ACTION# DELETE A SINGLE ACTION
	app.delete('/api/actions/:id', passport.authenticate('jwt', { session: false}),function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			//console.log("req.params.id: " + req.params.id);
			Action.remove({
				'id': req.params.id
			}, function(err, action) {
				if (err){
					res.send(err);
					console.log("err: " + err);	
				} else {    
					res.json({ message: 'Aktion erfolgreich gelöscht.' });
					console.log("action successfully deleted" );
				}
			});
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});

	//ACTION# GET A SINGLE ACTION OBJECT IDENTIFIED BY THE UNIQUE CALENDAR ID
	app.get('/api/actions/:id', passport.authenticate('jwt', { session: false}),function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			//console.log("req.params.id: " + req.params.id);
			
			Action.findOne({ 'id': req.params.id }, function (err, action) {
				if (err) {
					res.send(err);
					console.log("err: " + err);
					console.log("req.params.id: " + req.params.id);
				}else {
					console.log("err: " + err);
					res.json(action);
				}
			});
			
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	//ACTION# UPDATE A SINGLE ACTION
	app.put('/api/actions/:id', passport.authenticate('jwt', { session: false}),function(req, res) {
		var token = getToken(req.headers);
		if (token) { } else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
		
		// Token is valid
		
		var decoded = jwt.decode(token, config.secret);
		
		Action.findOne({ 'id': req.params.id }, function(err, action) {
			if (err) {
				res.send(err);
				return;
			}
			
			action.enabled = req.body.enabled;
			action.id = req.body.id;  // update the action info
			action.type = req.body.type;
			action.title = req.body.title;
			action.start = req.body.start;
			action.end = req.body.end;
			action.allDay = req.body.allDay;
			action.email = req.body.email;
			action.color = req.body.color;
			action.fields = req.body.fields;
			action.filepath = req.body.filepath;
			
			// save the action
			action.save(function(err) {
				if (err) {
					res.send(err);
					return;
				}
				
				res.json({ message: 'Aktion wurde upgedated.' });
			});
		});
		
		
	});
	
	//ACTION# GET ALL CURRENT ACTIONS, FOR A USER BY EMAIL (PARTNERID)
	app.get('/api/actions/current/user/:email', function(req, res) {
		
		//TODO FIXME: usually moongoose can query date:
		//'start': {$lte: unsafeNow}, 'end': {gte: new Date()
		Action.find(function(err, actions) {
			if (err) throw err;
			
			if (!actions) {
				console.log("No actions found.");			
				return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
			} else {
				
				var now = new Date();
				resultArray = [];
				
				for(var i = 0; i < actions.length; i++){
					
					if (actions[i].start < now && actions[i].end > new Date()) {
						resultArray. push(actions[i]);
					} else {
						console.log('start: ' + actions[i].start);
						console.log('end: ' + actions[i].end);
						console.log('now: ' + now);
					}
				}
				
				res.json({success: true, actions: resultArray});
			}
		});
	});
	
	//TODO GET A TABLE FOR CLIENTS TO VIEW
	/*
	app.get('/api/users/clientTable',
		function(req, res) {
			var partnerId = 'demo';	//req.params.partnerId;
			var tableId = '0';	//req.params.tableId;
			SERVER.BACKEND.getClientTable(partnerId, tableId,
				function(table) {
					res.json(table);
				},
				function(error) {
					res.status(403).send({success: false, msg: 'getClientTable failed: ' + error});
				}
			);
	});
	*/

	app.get('/api/users/clientTable/table/partnerId/:partnerId/tableId/:tableId',
		//passport.authenticate('jwt', { session: false}),
		function(req, res) {
		
		var token = getToken(req.headers);
		//if (token) {
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			
			console.log('/api/users/clientTable/table/partnerId/:partnerId/tableId/:tableId');
			
			Tables.findOne(
				{
					'partnerId': partnerId,
					'tableId': tableId
				},
				
				function(err, result) {
					
					if (result === null) {
						put('Table.find(' + partnerId + ', ' + tableId + ') returned null!');
						res.status(403).send({success: false, msg: 'clientTable Table.find(' + partnerId + ', ' + tableId + ') returned null!'});
						return;
					}
					if (err) {
						put('Table.find error: ' + error);
						res.status(403).send({success: false, msg: 'clientTable failed while Table.findOne: ' + error});
						return;
					}
					
					var table = result.table[0];	//@TODO: It should not be an array...
					res.json(table);
					
				}
			);
		
		//} else {
		//	console.log("STATUS 403:  No token provided.");
		//	return res.status(403).send({success: false, msg: 'No token provided.'});
		//}
	});

	/*
	//TODO PRICING# (CLIENT) GET AL TABLES FOR CLIENTS TO VIEW
	app.get('/api/users/clientTables',
		function(req, res) {
			var partnerId = 'demo';	//req.params.partnerId;
			getClientTables(partnerId,
				function(table) {
					res.json(table);
				},
				function(error) {
					res.status(403).send({success: false, msg: 'getClientTables failed: ' + error});
				}
			);
	});
	*/
	//PRICING# (Client) GET A TABLE FOR A USER
	app.get('/api/users/clientTable/tables/partnerId/:partnerId',
		//passport.authenticate('jwt', { session: false}),
	function(req, res) {
		var token = getToken(req.headers);
		//if (token) {
			var partnerId = req.params.partnerId;
			
			Tables
			.find({'partnerId': partnerId})
			.exec(function(err, results) {
				
				if (err){
					var msg = 'clientTable/names failed: ' + err;
					console.log(msg);
					res.status(403).send({success: false, msg: msg});
					return;
				}
				
				//console.log('results=' + JSON.stringify(results, null, '\t'));
				
				if (results === null) {
					console.log("No table found.");
					return;
				}
				
				/*
				var ids = [];
				for (var rI in results) {
					var result = results[rI];
					
					var table = result.table[0];	//@TODO: It should not be an array...
					
					var tableId = table.name;
					ids.push(tableId);
				}
				res.json(ids);
				*/
				
				var tables = [];
				for (var rI in results) {
					var result = results[rI];
					var table = result.table[0];	//@TODO: It should not be an array...
					tables.push(table);
				}
				res.json({'tables': tables});
				
			});
			
		//} else {
		//	console.log("STATUS 403:  No token provided.");
		//	return res.status(403).send({success: false, msg: 'No token provided.'});
		//}
		
	});
	
	
	//PRICING# (ADMIN) GET A TABLE FOR A USER
	app.get('/api/users/adminTable/table/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			
			console.log('/api/users/adminTable/table/partnerId/:partnerId/tableId/:tableId');
			
			Tables.findOne(
				{
					'partnerId': partnerId,
					'tableId': tableId
				},
				
				function(err, result) {
					
					if (result === null) {
						put('Table.find(' + partnerId + ', ' + tableId + ') returned null!');
						res.status(403).send({success: false, msg: 'getAdminTable Table.find(' + partnerId + ', ' + tableId + ') returned null!'});
						return;
					}
					if (err) {
						put('Table.find error: ' + error);
						res.status(403).send({success: false, msg: 'getAdminTable failed while Table.findOne: ' + error});
						return;
					}
					
					var table = result.table[0];	//@TODO: It should not be an array...
					res.json(table);
					
				}
			);
		
		} else {
			console.log("STATUS 403:  No token provided.");
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	
	
	
	//PRICING# (ADMIN) GET A TABLE FOR A USER (in grid format)
	app.get('/api/users/adminTable/grid/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			
			console.log('/api/users/adminTable/grid/partnerId/:partnerId/tableId/:tableId');
			//put('Trying to find table partnerId=' + partnerId + ', tableId=' + tableId);
			
			Tables.findOne(
				{
					'partnerId': partnerId,
					'tableId': tableId
				},
				
				function(err, result) {
					
					if (result === null) {
						put('Table.find(' + partnerId + ', ' + tableId + ') returned null!');
						res.status(403).send({success: false, msg: 'getAdminTable Table.find(' + partnerId + ', ' + tableId + ') returned null!'});
						return;
					}
					if (err) {
						put('Table.find error: ' + error);
						res.status(403).send({success: false, msg: 'getAdminTable failed while Table.findOne: ' + error});
						return;
					}
					
					// Now transform our table into grid table...
					
					var table = result.table[0];	//@TODO: It should not be an array...
					var resultTable = [];
					
					for (var rowI = 0; rowI < table.rows.length; rowI++) {
						var row = table.rows[rowI];
						
						// Build result rows
						var resultRow = {};
						
						// Add row title as first column (if available)
						var rowTitle = '';
						if (row.title) rowTitle = row.title.join("\n");
						resultRow[table.name] = rowTitle;
						
						
						for (var colI = 0; colI < table.columns.length; colI++) {
							var colName = table.columns[colI].title;
							var cellData = row.cells[colI];
							
							// Convert from our table format to the one used by grid
							var resultValue = JSON.stringify(cellData);
							
							switch (cellData.type) {
								case 'empty':
									resultValue = '';
									break;
								
								case 'text':
									if (cellData.text instanceof Array) {
										resultValue = cellData.text.join("\n");
									} else {
										resultValue = cellData.text;
									}
									break;
								
								case 'price':
									// Make "human readable" text for the price (e.g. language, currency symbol, ....)
									resultValue = 'VK: ' + parseFloat(cellData.price) + '; ';
									resultValue += 'UVP: ' + parseFloat(cellData.uvp) + '; ';
									resultValue += 'EK: ' + parseFloat(cellData.ek);
									break;
								
								default:
									resultValue = '[unknown cell type "' + cellData.type + '"]';
							}
							
							// Store the value.
							resultRow[colName] = resultValue;
						}
						resultTable.push(resultRow);
					}
					
					
					res.json(resultTable);
				}
			);
		
		} else {
			console.log("STATUS 403:  No token provided.");
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	/*
	//PRICING# (ADMIN) GET A TABLE FOR A USER (in grid format)
	app.get('/api/users/adminTable/grid/actions/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			
			console.log('/api/users/adminTable/grid/actions/partnerId/:partnerId/tableId/:tableId');
			//put('Trying to find table partnerId=' + partnerId + ', tableId=' + tableId);
			
			Tables.findOne(
				{
					'partnerId': partnerId,
					'tableId': tableId
				},
				
				function(err, result) {
					
					if (result === null) {
						put('Table.find(' + partnerId + ', ' + tableId + ') returned null!');
						res.status(403).send({success: false, msg: 'getAdminTable Table.find(' + partnerId + ', ' + tableId + ') returned null!'});
						return;
					}
					if (err) {
						put('Table.find error: ' + error);
						res.status(403).send({success: false, msg: 'getAdminTable failed while Table.findOne: ' + error});
						return;
					}
					
					// Now transform our table into grid table...
					
					var table = result.table[0];	//@TODO: It should not be an array...
					var resultTable = [];
					
					for (var rowI = 0; rowI < table.rows.length; rowI++) {
						var row = table.rows[rowI];
						
						// Build result rows
						var resultRow = {};
						
						// Add row title as first column (if available)
						var rowTitle = '';
						if (row.title) rowTitle = row.title.join("\n");
						resultRow[table.name] = rowTitle;
						
						
						for (var colI = 0; colI < table.columns.length; colI++) {
							var colName = table.columns[colI].title;
							var cellData = row.cells[colI];
							
							// Convert from our table format to the one used by grid
							var resultValue = JSON.stringify(cellData);
							
							switch (cellData.type) {
								case 'empty':
									resultValue = '';
									break;
								
								case 'text':
									if (cellData.text instanceof Array) {
										resultValue = "";
									} else {
										resultValue = "";
									}
									break;
								
								case 'price':
									// Make "human readable" text for the price (e.g. language, currency symbol, ....)
									resultValue = 'VK: ' + parseFloat(cellData.price) + '; ';
									resultValue += 'UVP: ' + parseFloat(cellData.uvp) + '; ';
									resultValue += 'EK: ' + parseFloat(cellData.ek) + '; ';
									
									//server-side price calculation for visualization of discountPercent
									var discountTotal = cellData.uvp - cellData.price;  
									
									var discountPercent = (discountTotal / cellData.uvp) * 100;
									
									resultValue += 'Aktionsrabatt: ' + parseFloat(discountPercent) + '; ';
									
									resultValue += 'Wert: ?' + '; ';
									
									resultValue += 'Einheit: ?';
									
									break;
								
								default:
									resultValue = '[unknown cell type "' + cellData.type + '"]';
							}
							
							// Store the value.
							resultRow[colName] = resultValue;
						}
						resultTable.push(resultRow);
					}
					
					
					res.json(resultTable);
				}
			);
		
		} else {
			console.log("STATUS 403:  No token provided.");
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	
	*/
	//PRICING# (ADMIN) GET COLUMNDEFS (for the grid component!) OF A TABLE FOR A SINGLE TABLE
	app.get('/api/users/adminTable/columnDefs/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			
			
			Tables.findOne({'partnerId': partnerId, 'tableId': tableId}, function(err, result) {
				
				if (err){
					res.status(403).send({success: false, msg: 'adminTable/columnDefs failed: ' + err});
				}
				if (!result) {
					console.log("No table found.");
					return;
				}
				
				var table = result.table[0];	//@TODO: It should not be an array...
				
				var columnDefs = [];
				
				// Add table name as first column (it contains the row titles)
				// See: http://ui-grid.info/docs/#/api/ui.grid.edit.api:ColumnDef
				columnDefs.push({
					"name": table.name,
					"enableCellEdit": false,
					"enableSorting": false
				});
				
				for (var colI in table.columns) {
					var col = table.columns[colI];
					var colName = col.title;
					
					columnDefs.push({
						"name": colName.join("\n"),
						"enableCellEditOnFocus": true,
						"enableSorting": false
					});
				}
				res.json(columnDefs);
			});
		
		} else {
			console.log("STATUS 403:  No token provided.");
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
		
	});
	
	//PRICING# (ADMIN) GET ALL TABLES FOR A USER
	app.get('/api/users/adminTables/ids/partnerId/:partnerId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		var token = getToken(req.headers);
		if (token) {
			var partnerId = req.params.partnerId;
			
			Tables
			.find({'partnerId': partnerId})
			.exec(function(err, results) {
				
				if (err){
					var msg = 'adminTables/names failed: ' + err;
					console.log(msg);
					res.status(403).send({success: false, msg: msg});
					return;
				}
				
				//console.log('results=' + JSON.stringify(results, null, '\t'));
				
				if (results === null) {
					console.log("No table found.");
					return;
				}
				
				var ids = [];
				for (var rI in results) {
					var result = results[rI];
					
					var table = result.table[0];	//@TODO: It should not be an array...
					
					var tableId = table.name;
					ids.push(tableId);
				}
				res.json(ids);
				
			});
			
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
		
	});
	

	//PRICING# UPDATE A SINGLE TABLE
	app.post('/api/users/adminTable/table/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}), function(req, res) {
		
		console.log("POST: /api/users/adminTable/table");
		//console.log("req.body: " + JSON.stringify(req.body));
		
		var token = getToken(req.headers);
		if (token) {
			
			//console.log('req.body=' + JSON.stringify(req.body));
			
			var partnerId = req.params.partnerId;
			var tableId = req.params.tableId;
			var newTable = req.body;	//.table;
			
			//console.log('newTable=' + JSON.stringify(newTable));
			
			
			//check if there are future events --> if yes dont allow to change content of table
			//else allow update
			Action.find(function(err, actions) {
				if (err) throw err;
				
				if (!actions) {
					console.log("No actions found.");			
					return res.status(403).send({success: false, msg: 'Keine Aktion gefunden.'});
				} else {
					
					var now = new Date();
					resultArray = [];
					
					for(var i = 0; i < actions.length; i++){
						
						//check only for actions of this user
						if(actions[i].email == partnerId){
						
							//current actions or future actions
							if (actions[i].start < now && actions[i].end > new Date() ||  actions[i].start > now) {
								resultArray. push(actions[i]);
							} else {
								console.log('start: ' + actions[i].start);
								console.log('end: ' + actions[i].end);
								console.log('now: ' + now);
							}
						}
					}
					
					if(resultArray.length > 0){
						// update is not allowed
						return res.status(500).send({success: false, msg: 'Speichern nicht möglich! Es dürfen keine Aktionen in der Zukunft bestehen, wenn Inhalte der Tabelle geändert werden!'});
						
					} else {
						//update is allowed
						Tables.findOne({ 'partnerId': partnerId, 'tableId': tableId  }, function(err, result) {
							if (err) {
								console.log('Can not save, because the there was an error while getting the old one: ' + err);
								res.send(err);
								return;
							}
							
							//console.log(JSON.stringify(result, null, '\t'));
							
							// Save the given data into the data base
							result.table = [newTable];	//@TODO: This should not be an array
							
							result.save(function(err) {
								if (err){
									console.log(err);
									res.send(err);
								} else {	
									console.log("tables updated!");
								res.json({ message: 'Die Inhaltsänderungen dieser Tabelle wurden gepeichert!' });
								}
							});
							
						});
						
					}
					
				}
			});
			
			
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	});
	
	//PRICING# UPLOAD A FILE CONTAINING NEW PRICES
	app.post('/api/priceUpload/:partnerId', passport.authenticate('jwt', { session: false}), function(req, res) {
			
		var token = getToken(req.headers);
		if (token) {
			
			var file = req.files[0];
			var partnerId = req.params.partnerId;
			
			var buffer = fs.readFile(file.path, function (err, data) {
				
				var newPath = SERVER.PATHS.PARTNER + '/' + partnerId+ '/uploads/tables.ods';
				
				var pathStart = SERVER.PATHS.PARTNER + '/' + partnerId+ '/uploads/';
				
				if(newPath.substr(0, pathStart.length) == pathStart) { 
					console.log('newPath starts with pathStart: thats good!');
				
				  fs.writeFile(newPath, data, function (err) {
					res.redirect("back");
					console.log("It's saved");
					
					var odsData = data;
					
					// Parse ODS file
					SERVER.PARSE_ODS.parseOds(odsData, function(tableList) {
						
						var tables = tableList.tables;
						
						var id = "";
						
						for (var i in tables) {
							
							var jsTable = [];
							jsTable.push(tables[i]);
							
							id = tables[i].name;
							
							var tablesEntry = new Tables({
								uniqueId: partnerId + '_' + id,
								partnerId: partnerId,
								tableId: id,
								table: jsTable
							});
							
							tablesEntry.save(function(err) {
								
								if (err) {
									console.log("Error on creating a new entry in tables: " + err);
									return res.json({success: false, msg: 'Der Eintrag existiert bereits in der Tabelle.'});
								}
								console.log('Successful created new entry in tables.');	
								res.json({success: true, msg: 'Der neue Eintrag wurde erfolgreich hinzugefügt.'});
								
							});
							
						}
						
					});
					
				  });
				  
				} else {
					return res.status(403).send({success: false, msg: 'tryed to hack the pathname.'});
				}
				  
				});
			
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
		
	});
	
	
	//ACTION# DELETE A SINGLE ACTION
	app.delete('/api/users/destroy/partnerId/:partnerId/tableId/:tableId', passport.authenticate('jwt', { session: false}),function(req, res) {
		
		var token = getToken(req.headers);
		  if (token) {
			var decoded = jwt.decode(token, config.secret);
		
			//console.log("req.params.partnerId: " + req.params.partnerId);	
			//console.log("req.params.tableId: " + req.params.tableId);	
							
			Tables.remove({'partnerId': req.params.partnerId, 'tableId': req.params.tableId}, function(err) {
									
				if (err){
					res.send(err);
					console.log("err: " + err);	
									
				}else {    
					res.json({ msg: 'Tabelle erfolgreich gelöscht' });
					console.log("Deleted table successfully." );
				}
			});
		  }else {
				console.log("STATUS 403:  No token provided.");	  
				return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
	});
	
	//GET ALL FILES OF AN OPTICIAN (FROM HIS FOLDER) AND SEND A LIST
	app.get('/api/files/partnerId/:partnerId', passport.authenticate('jwt', { session: false}), function(req, res) {
	
		var token = getToken(req.headers);
		if (token) {
			
			var partnerId =  req.params.partnerId;
			
			var folder = SERVER.PATHS.PARTNER + '/' + partnerId+ '/uploads/';
			
			fs.readdir(folder, function(err, files) {
			    if (err) {
			    	res.send(err);
			    }
			    res.json(files);
			});

		
		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
	
	});
	
	//UPLOAD# SAVE A FILE TO A FOLDER ON SERVER
	app.post('/api/fileUpload/partnerId/:partnerId/filename/:filename', passport.authenticate('jwt', { session: false}), function(req, res) {
			
		//console.log('/api/fileUpload/partnerId/:partnerId/filename/:filename');
		
		var token = getToken(req.headers);
		if (token) {
			
			var partnerId =  req.params.partnerId;
			var filename = req.params.filename;

			var file = req.files[0];
			
			//console.log("file" + JSON.stringify(file));
			
			fs.readFile(file.path, function (err, data) {
				  
				var newPath = SERVER.PATHS.PARTNER + '/' + partnerId+ '/uploads/' + filename;//file.name;

				var pathStart = SERVER.PATHS.PARTNER + '/' + partnerId+ '/uploads/';
				
				if(newPath.substr(0, pathStart.length) == pathStart) { 
					console.log('newPath starts with pathStart: thats good!');
					
					fs.writeFile(newPath, data, function (err) {
						res.redirect("back");
						console.log("It's saved");
					  });
				} else {
					return res.status(403).send({success: false, msg: 'tryed to hack the pathname.'});
				}
				  
				});

		} else {
			console.log("STATUS 403:  No token provided.");	  
			return res.status(403).send({success: false, msg: 'No token provided.'});
		}
			
	});
	
	
	//EXTRAS# UPDATE/CREATE A LIST OF EXTRAS FOR A SPECIFIC USER
	app.put('/api/users/extras', passport.authenticate('jwt', { session: false}),function(req, res) {

		console.log('/api/users/extras');
		
		var token = getToken(req.headers);
		  if (token) {
			var decoded = jwt.decode(token, config.secret);
			
			
			console.log("req.body" + JSON.stringify(req.body));
			
			var partnerId = req.body.email;
			var table = req.body.table;
			
		
			Extra.findOne({ 'email': partnerId },  function(err, extra) {
				if (err) {
					throw err;
				} 
		 
				if (!extra) {
				  console.log("No Extra-Entry for this User exists.");			
				 
				  //create an entry
				  var newExtra = new Extra({
					  email: partnerId,
					  table: table
				  });
			
				  newExtra.save(function(err) {
				
					  if (err) {
						  console.log("Error on creating a initial extra entry: " + err);
					  } else {
						  console.log('Successful created new initial extra entry.');	
					  }
				  });
				  
				  
				} else {
					
					extra.table = table;

					// save the new status of the user
					extra.save(function(err) {
						if (err)
							res.send(err);

						res.json({ message: 'Der Eintrag wurde upgedated.' });
					});
				}
			});
		
		  }else {
				console.log("STATUS 403:  No token provided.");	  
				return res.status(403).send({success: false, msg: 'No token provided.'});
		  }
		
	});
	
	
	//EXTRAS# GET THE EXTRA-ENTRY FOR A SPECIFIC USER
	app.get('/api/users/extras/partnerId/:partnerId', function(req, res) {
	 
		
		var partnerId =  req.params.partnerId;
		
		Extra.findOne({ 'email': partnerId }, function (err, extra) {
			if (err){
				res.send(err);
				console.log("err: " + err);
			}else {
				console.log("err: " + err);
				res.json(extra);
			}
		});
		
		
			
	});
	
	
	
	put('Using server root: "' + SERVER.PATHS.ROOT + '"');
	if (!fs.existsSync(SERVER.PATHS.SERVER)) {
		put('Sanity check failed: There is no directory "' + SERVER.PATHS.SERVER + '"!');
		put('Aborting.');
		return;
	}
	
	
	put('Including middleware...');
	
	/*
		// Use Compression
		put('Enabling compression...');
		var compression = require('compression');
		app.use(compression);
	*/
	
	// Cookie handler
	put('Enabling Cookies...');
	app.use(cookieSession({
		keys: ['id', 'counter', 'lang']	//, 'cart', 'shopId']	//, 'shopInfo']
	}));
	
	
	// Dynamic content
	put('Installing dynamic handler...');
	app.use(serveDynamic);
	
	// Static content
	put('Installing static handler...');
	//app.use(serveStatic(SERVER.PATHS.PUBLIC));
	app.use(serveStatic(SERVER.PATHS.SHARED, {
		//'index': ['index.html', 'index.sstpl', 'index.ssjs'],
		/*
		'setHeaders': function(res, path) {
			if (/.*\.js/.test(path)) {
				put('Setting Content-Type for js...');
				res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
			}
			else
			if (/.*\.html/.test(path)) {
				put('Setting Content-Type for html...');
				res.setHeader('Content-Type', 'text/html; charset=utf-8')
			}
			
		}
		*/
	}));
	
	put('Starting to listen on port ' + SERVER.SERVER_PORT + ', serving "' + SERVER.PATHS.SHARED + '"...');
	app.listen(SERVER.SERVER_PORT);
	
	/*
	put('Starting back-end watchdog...');
	function watchdog() {
		put('watchdog(): Watchdog is keeping alive the backend...');
		SERVER.BACKEND.watchdog();
	}
	setInterval(watchdog, SERVER.WATCHDOG_INTERVAL);
	//watchdog();
	*/
	
	put('Server is ready.');
}

if (require.main === module) {
	//put('This file was called directly, running main()...');
	main();
}