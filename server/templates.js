var TEMPLATES = {
	REVISION: '2'
}
var path = require('path');	// For sanitizing paths
var fs = require('fs');
//var syncRequest = require('sync-request');
var backend = require('./backend.js');
var SERVER = global.SERVER;


var CR = '\n';
var lang = require(SERVER.PATHS.SHARED + '/includes/lang.js');


function put(txt) {
	//console.log('templates.js:	' + txt);
	
	var l = 'templates.js:\t' + txt;
	
	if (typeof TEMPLATES.put_external === 'function') {
		TEMPLATES.put_external(l); 
	} else {
		console.log(l);
	}
	return txt;
}
TEMPLATES.put = put;
TEMPLATES.put_external = 0;


function dump(o) {
	//var JSON = require('json');
	//return util.inspect(o, {showHidden: true, depth: null});
	//return util.inspect(o, {showHidden: true, depth: 3});
	return JSON.stringify(o, null, 2);
}

function sanitize(id) {
	if (id == undefined) return '';
	if (id == null) return '';
	
	id = id.replace( /\t/ , "");
	id = id.replace( /\n/ , "");
	id = id.replace( /\r/ , "");
	id = id.replace( /\b/ , "");
	id = id.replace( /\f/ , "");
	id = id.replace( /[^a-zA-Z0-9]/ , "");
	return id;
}

/*
	Shortcut to language look-up

function _(langISO, langId, arg1, arg2, arg3, arg4, arg5, arg6) {
	return lang.resolve(langISO, langId, arg1, arg2, arg3, arg4, arg5, arg6);
}
*/

/*
	Sanitize string to be put into an html attribute
*/
function encodeAttrib(t) {
	return t;
}
TEMPLATES.encodeAttrib = encodeAttrib;


/*
	Sanitize string for HTML output
*/
function encodeHtml(t) {
	return t;
}
TEMPLATES.encodeHtml = encodeHtml;


/*
	Return the contents of a file.
	Keep performance and security in mind when using this!
*/
function getFile(file) {
	
	//var p = path.resolve(PUBLIC_DIR + file);
	
	//put('getFile("' + file + '")...');
	var p = path.resolve(file);
	
	//put('...sanitized to "' + p+ '"...');
	
	// Check if inside public dir
	//if (!p.startsWith(PUBLIC_DIR)) return put('File [' + (file) + '] not allowed.');
	if (
		(p.substr(0,SERVER.PATHS.SHARED.length) == SERVER.PATHS.SHARED)
		// || (p.substr(0,SERVER.PATHS.PUBLIC.length) == SERVER.PATHS.PUBLIC)
	) {
		// Serve file
		return fs.readFileSync(p).toString();
	} else {
		return put('File [' + (file) + '] not allowed.');
	}
	
}
TEMPLATES.getFile = getFile;

/*
function getUrl(url) {
	var res = syncRequest('GET', url);
	return res.getBody();
}
*/
function getUrl(url) {
	var request = require('urllib-sync').request;
	var res = request(url);
	// res should have status, data, headers 
	return res.data;
}
TEMPLATES.getUrl = getUrl;


/*
	Main function to replace marks by dynamic content
*/
function servePart(tag, req, basePath) {
	
	var SERVER = global.SERVER;
	
	// Extract shopId provided by the server
	var shopId = req.session.shopId;
	
	// Extract shopInfo provided by the server
	var shopInfo = req.shopInfo;
	
	// Extract productId from server
	var productId = sanitize(req.productId);
	
	/*
	var productDefinitions = null;
	var productClasses = null;
	if ((shopInfo !== undefined) && (shopInfo !== null) && (shopInfo.toolParams !== undefined)) {
		productDefinitions = shopInfo.toolParams.products;
		productClasses = shopInfo.toolParams.productClasses;
	}
	
	var productIds = [];
	var productDefinition = null;
	var productClass = null;
	var i;
	var p;
	if ((shopInfo !== undefined) && (shopInfo !== null) && (productId !== null) && (productDefinitions !== undefined) && (productDefinitions !== null)) {
		for (i in productDefinitions) {
			p = productDefinitions[i];
			if (p.productId == productId) {
				productDefinition = p;
				//break;
			}
			productIds.push(p.productId);
		}
		
		if ((productDefinition !== undefined) && (productDefinition !== null))
		for (i in productClasses) {
			p = productClasses[i];
			if (p.name == productDefinition.productClass) {
				productClass = p;
			}
		}
	}
	*/
	
	// Parse tag arguments
	//@TODO: Actually parse the arguments so we can pass JSON objects
	var args = [];
	if (tag.substr(tag.length-1,1) == ')') {	//.endsWith(')')) {
		//put('tag=' + tag);
		var p = tag.indexOf('(');
		
		//put('p=' + p);
		var argsString = tag.substring(p+1, tag.length - 1);
		args = argsString.split(',');
		//put('args=' + args);
		
		tag = tag.substr(0, p);
	}
	
	
	var langISO = 'na_NA';
	if ((req.session) && (req.session.lang)) {
		langISO = req.session.lang;
	}
	// Short hand language resolver (with pre-filled langISO from session)
	function _(langId, arg1,arg2,arg3,arg4,arg5,arg6) {
		return lang.resolve(langISO, langId, args[1], args[2], args[3], args[4], args[5], args[6]);
	}
	
	
	switch(tag) {
		
		case 'DEBUG':
			return	'<div>'
				+ 'lang=' + (langISO)
				+ '<br />'
				+ '<a href="/actions/switchLang.ssjs?lang=de_DE" target="_switch">DE</a>'
				+ '|'
				+ '<a href="/actions/switchLang.ssjs?lang=en_US" target="_switch">EN</a>'
				+ '</div>';
			break;
		
		case 'HTTP_PARAM':
			if (args.length != 1) return '';
			return req.params[args[0]];
			break;
		
		case 'IP':
			return req.connection.remoteAddress;
			break;
		
		case 'COMMENT':
			return '';
			break;
		
		/*
		case 'DUMP':
			if (args.length != 1) return '?';
			
			//@FIXME: Caution! Evaling arguments (but they come from server-side files and are not user-data)
			return dump(eval(args[0]));
			break;
		
		case 'VAL':
			if (args.length != 1) return '?';
			//@FIXME: Caution! Evaling arguments (but they come from server-side files and are not user-data)
			r = '';
			try {
				r = eval(args[0]);
			} catch(e) {
				r = '';
			}
			return r;
			break;
		*/
		
		case 'LANG':
			// Ensure length
			while(args.length < 7) args.push("");
			//return _(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
			
			var langId = args[0];
			// return lang.resolve(langISO,	langId,	args[1], args[2], args[3], args[4], args[5], args[6]);
			return _(langId, args[1], args[2], args[3], args[4], args[5], args[6]);
			break;
		
		case 'TEMPLATE':
			// Templates use relative paths
			if (args.length == 1) {
				var filename = args[0];
				var r = '';
				//r += '<!-- TEMPLATE(' + filename + ') -->';
				
				// Parse template file
				//var tpl = fs.readFileSync(p).toString();
				absFilename = path.dirname(basePath) + '/' + filename;
				//r += '<!-- absolute="' + absFilename + '" -->';
				
				var tpl = getFile(absFilename);
				r += applyTemplate(tpl, req, absFilename);
				
				//r += '<!-- END OF TEMPLATE(' + filename + ') -->';
				return r;
				
			} else {
				return '(INCLUDE needs one arg!)';
			}
			break;
			
			
		case 'INCLUDE':
			// Includes are always in INCLUDE_DIR
			if (args.length == 1) {
				var filename = args[0];
				if (!SERVER.PRODUCTION) r = '<!-- INCLUDE(' + filename + ') -->';
				
				// Parse template file
				//absFilename = SERVER.PATHS.INCLUDES + '/' + filename;
				absFilename = path.resolve(path.dirname(basePath) + '/' + filename);
				
				//r += '<!-- absolute="' + absFilename + '" -->';
				
				if (absFilename.endsWith('.ssjs')) {
					// Serve dynamic server side JavaScript
					put('Dynamic include-serve of SSJS "' + absFilename + '"...');
					var page = require(absFilename);
					page.put_external = TEMPLATES.put_external;
					page.errorHandler_external = TEMPLATES.errorHandler_external;
					try {
						//var SERVER = 0;
						//r += page.serve(SERVER, req);
						r += page.serve(0, req);
					} catch(e) {
						put('!!! Exception while running include: ' + e);
						SERVER.errorHandler(e);
					}
					
				} else
				if (absFilename.endsWith('.sstpl')) {
					// Serve dynamic server side template
					var tpl = getFile(absFilename);
					r += applyTemplate(tpl, req, absFilename);
					
				}
				if (!SERVER.PRODUCTION) r += '<!-- /INCLUDE(' + filename + ') -->';
				
				return r;
				
			} else {
				return '(INCLUDE needs one arg!)';
			}
			break;
		
		
		
		case 'SHOP_INIT':
			// Store shop id
			
			if (args.length >= 1) {
				// Get current shopId from template tag parameter: %%%SHOP_INIT(12345)%%%
				var shopId = args[0];
				
				// Store shopId in session
				req.session.shopId = shopId;
				
				if (args.length >= 2) {
					// Override missing request productId with the given one
					if ((req.productId === undefined) || (req.productId == null)) {
						req.productId = args[1];
					}
				}
				
				// Tell server to load shopInfo!
				SERVER.loadShopInfo(shopId, req);
				
				return '<!-- shopId=' + shopId + ' -->';
				//+ ('<script type="text/javascript" src="../tool/js/shopUtils.js"></script>');
				
			} else {
				return '<!-- This shop is not initialized properly. No shopId in SHOP_INIT! -->';
			}
			break;
			
		
		case 'SESSION_ID':
			return req.session.id;
			break;
		
		case 'SHOP_ID':
			return shopId;
		
			
		default:
			put('Unknown tag "' + tag + '"!');
			return tag + '?';
	}
}
TEMPLATES.servePart = servePart;

// Apply the given template (string) using the given request values
function applyTemplate(tpl, req, basePath) {
	//put('applyTemplate(basePath="' + basePath + '")');
	
	var mark = '%%%';
	
	var r = '';
	var o = 0;
	var oo = 0;
	do {
		o = tpl.indexOf(mark, o);
		if (o >= 0) {
			//put('Mark found at ' + o);
			
			r += tpl.substr(oo, o-oo);
			o += mark.length;
			
			var o2 = tpl.indexOf(mark, o);
			if (o2) {
				var tag = tpl.substr(o, o2-o);
				//put('tag="' + tag + '"');
				
				r += servePart(tag, req, basePath);
				
				o = o2 + mark.length;
			} else {
				put('Tag does not end at ' + o + '!');
				break;
			}
			
		} else {
			// Nothing (more) found
			break;
		}
		oo = o;
	} while (o < tpl.length);
	
	// Add the rest
	r += tpl.substr(oo);
	return r;
}
TEMPLATES.applyTemplate = applyTemplate;

module.exports = TEMPLATES;