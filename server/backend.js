/*
	Server-side backend module, fetching all the data
*/
var BACKEND = {
	REVISION: '2'
};

var path = require('path');	// For sanitizing paths
var fs = require('fs');	// For caching


var ROOT_PATH = path.resolve('..');
var DATA_PATH = path.resolve(ROOT_PATH + '/data');
var PARTNER_PATH = path.resolve(ROOT_PATH + '/partner');
var METHOD_GET = 'GET';
var METHOD_POST = 'POST';


function put(txt) {
	//SERVER.put('backend.js:\t' + txt);
	console.log('backend.js:\t' + txt);
	return txt;
}



BACKEND.getPartnerIds = function() {
	var partnerIds = [];
	var dir = PARTNER_PATH;
	var files = fs.readdirSync(dir);
	for (var i in files){
		var fileName = files[i];
		var name = dir + '/' + fileName;
		if (fs.statSync(name).isDirectory()){
			//getFiles(name, files_);
			partnerIds.push(fileName);
		} else {
			//files_.push(name);
		}
	}
	return partnerIds;
};


/*
	Execute any named action

BACKEND.doAction = function(action, o, onSuccess, onError) {
	switch(action) {
		case 'getData':
			return BACKEND.getData(o.typ, o.id, onSuccess, onError);
			break;
		
		case 'getPartnerIds':
			return onSuccess(BACKEND.getPartnerIds());
			break;
		
		case 'getPartnerData':
			return BACKEND.getPartnerData(o.partnerId, o.item, onSuccess, onError);
			break;
		
		default:
			onError('Unknown action "' + action + '"');
	}
}
*/

////////////////////////////////////////////////////////////////////////////////

BACKEND.getData = function(typ, id, onSuccess, onError) {
	
	/*
	var o = {
		'requestedTyp': typ,
		'requestedId': id,
		'test': 'This is data from server side backend.js',
	};
	*/
	
	var p = DATA_PATH + '/' + typ + '.' + id + '.json';
	if (!fs.existsSync(p)) {
		onError('Does not exist');
		return;
	}
	
	try {
		var json = fs.readFileSync(p);
		var o = JSON.parse(json);
		onSuccess(o);
	} catch(e) {
		put('Error loading data: ' + e);
		onError('Error loading data: ' + e);
	}
};



BACKEND.getPartnerData = function(partnerId, item, onSuccess, onError) {
	
	//@TODO: mongodb.get(parnerId, tableId, onSuccess...);
	
	var p = PARTNER_PATH + '/' + partnerId + '/' + item + '.json';
	if (p.length < PARTNER_PATH.length) {
		onError('Hello DROP TABLES!');
		return;
	}
	
	if (!fs.existsSync(p)) {
		onError('Does not exist (' + p + ')');
		return;
	}
	
	try {
		var json = fs.readFileSync(p);
		var o = JSON.parse(json);
		onSuccess(o);
	} catch(e) {
		put('Error loading data: ' + e);
		onError('Error loading data: ' + e);
	}
	
	
};
////////////////////////////////////////////////////////////////////////////////

BACKEND.getClientTable = function(partnerId, tableId, onSuccess, onError) {
	// Responds with a partner table (to be used for rendering on the client tablet)
	
	var tableId = parseInt(tableId)
	var item = 'tables';
	
	//@TODO: mongodb.get(parnerId, tableId, onSuccess...);
	
	BACKEND.getPartnerData(partnerId, item, 
		function(o) {
			// Transform stored JSON into Client-style JSON
			var table = o.tables[tableId];
			onSuccess(table);
		},
		function(error) {
			onError(error);
		}
	);
	
};

BACKEND.getClientTables = function(partnerId, onSuccess, onError) {
	// Responds with all partner tables (to be used for rendering on the client tablet)
	
	var item = 'tables';
	
	BACKEND.getPartnerData(partnerId, item, 
		function(o) {
			// Transform stored JSON into Client-style JSON
			var tables = o;	//.tables[tableId];
			onSuccess(tables);
		},
		function(error) {
			onError(error);
		}
	);
	
};


BACKEND.getAdminTableColumnDefs = function(partnerId, tableId, onSuccess, onError) {
	
	var table = null;
	
	//@TODO: mongodb.get(parnerId, tableId, onSuccess...);
	
	if(tableId == 0){
					
		table = [
	             {name: 'Gleitsicht' }, 
	             {name: 'G6' }, 
	             {name: 'G5' },
	             {name: 'G4' },
	             {name: 'G3' },
	             {name: 'G2' } 
                 ];
	}

	if(tableId == 1){
	  
		table = [
                 {name: 'Arbeitsplatz' }, 
                 {name: 'E6' }, 
                 {name: 'E5' },
                 {name: 'E4' },
                 {name: 'E3' },
                 {name: 'E2' } 
                 ];
	}

	onSuccess(table);
};

BACKEND.getAdminTable = function(partnerId, tableId, onSuccess, onError) {
	// Responds with a JSONused in the admin area (NG Grid)
	
	/*
	var item = 'tables';
	BACKEND.getPartnerData(partnerId, item, 
		function(o) {
			
			// Transform stored JSON into Client-style JSON
			
			var table = o[tableId];
			onSuccess(table);
		},
		function(error) {
			onError(error);
		}
	);
	*/
	
	//@TODO: Transform partnerData into a table for NG Grid
	// Just static content for now (testing)
	
	var table0 = [
		{
			"Gleitsicht": "Mindestzentrierhöhe",
			"G6": "reg - med - short\n14-21 in mm Stufen",
			"G5": "reg - med - short\n20 / 17 / 15",
			"G4": "reg - med - short\n20 / 17 / 15",
			"G3": "reg - short\n20 / 15",
			"G2": "reg - short\n21 / 15"
		},
		{
			"Gleitsicht": "Oberflächenveredelung",
			"G6": "Super ET, Lotus, antistatic",
			"G5": "Super ET, Lotus, antistatic",
			"G4": "Super ET, Lotus, antistatic",
			"G3": "Super ET, Lotus",
			"G2": "Super ET, Lotus"
		}
	];
	
	var table1 = [
	     {
			"Arbeitsplatz": "test",
			"E6": "test",
			"E5": "test",
			"E4": "test",
			"E3": "test",
			"E2": "test"
		},
		{
			"Arbeitsplatz": "test",
			"E1": "test",
			"E5": "test",
			"E4": "test",
			"E3": "test",
			"E2": "test"
		}
	];
	
	
	
	if(tableId == 0){
		console.log('table0');
		onSuccess(table0);
	}
	
	if(tableId == 1){
		console.log('table1');
		onSuccess(table1);
	}


	
};

BACKEND.getAdminTables = function(partnerId, onSuccess, onError) {
	
	var tables = [0, 1];
	
	onSuccess(tables);
	
};



BACKEND.postAdminTable = function(partnerId, tableId, o, onSuccess, onError) {
	
	//@TODO: Transform the given object into partner table JSON and save it!
	
	onSuccess(true);
	
};


////////////////////////////////////////////////////////////////////////////////

module.exports = BACKEND;