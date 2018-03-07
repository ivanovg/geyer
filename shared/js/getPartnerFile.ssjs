/*
	Checks if the given orderId has finished rendering.
*/

var SSJS = {REVISION: '2'};

var SERVER = global.SERVER;
function put(txt) {
	SERVER.put('getPartnerFile.ssjs:\t' + txt);
	return txt;
}

module.exports = SSJS;

var path = require('path');
var fs = require('fs');


SSJS.serve = function(server, req, res) {
	var partnerId = req.params['partnerId'];
	var fileId = req.params['fileId'];
	
	put('partnerId="' + partnerId + '", fileId="' + fileId + '"');
	
	if (partnerId === undefined) {
		return '<html><body>Nope</body></html>';
	}
	if (fileId === undefined) {
		return '<html><body>Nope</body></html>';
	}
	
	// Check uploads directory
	var dir = path.resolve(SERVER.PATHS.PARTNER + '/' + partnerId + '/uploads');
	//put('Absolute path="' + dir + '"');
	
	if (!dir.startsWith(SERVER.PATHS.PARTNER)) {
		return '<html><body>Nice try ("' + p + '" does not start with "' + (SERVER.PATHS.PARTNER + '/' + partnerId) + '").</body></html>';
	}
	
	if (!fs.existsSync(dir)) {
		return '<html><body>Partner "' + partnerId + '" is non-existent.</body></html>';
	}
	
	var p = path.resolve(dir + '/' + fileId);
	
	if (!p.startsWith(dir)) {
		return '<html><body>Nice try ("' + p + '" does not start with "' + (SERVER.PATHS.PARTNER + '/' + partnerId + '/uploads') + '").</body></html>';
	}
	
	
	if (!fs.existsSync(p)) {
		// Not found. Try a different filename?
		put('The file "' + p + '" does not exist. At least thats what fs.existsSync() says...');
		return '<html><body>File not found.</body></html>';
	}
	
	var mime = '';
	//@TODO: Chose a good mime according to file ext
	
	
	var data = '';
	try {
		data = fs.readFileSync(p);
		var hdr = {};
			
		if (mime != '') {
			hdr['Content-Type'] = mime;
		}
		
		res.writeHead(200, hdr);
		res.end(data);
		
	} catch(e) {
		// Error!
	}
	
	return;
}

