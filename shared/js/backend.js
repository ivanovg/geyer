/*
	This is the client-side backend proxy, calling /backend.ssjs.
	All front-end stuff should use these methods to communicate with the server.
	
	This script requests /shared/backend.ssjs, which in turn calls methods of server:BACKEND (/server/backend.js)
*/
var BACKEND = {
};


BACKEND.GET = function(url, o, onSuccess, onError) {
	put('GET()...');
	var http = new XMLHttpRequest();
	
	var url = url;	//'/backend.ssjs';
	
	for (var k in o) {
		var v = o[k];
		
		if (url.indexOf('?') != -1)
			url += '&';
		else
			url += '?';
		
		//@TODO: URL-Encode v
		url += k + '=' + v;
	}
	
	
	put('GET(): url="' + url + '"');
	http.open('GET', url, true);
	//http.open('POST', url, true);
	//http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	http.onreadystatechange = function() {//Call a function when the state changes.
		if (http.readyState == 4) {
			if (http.status == 200) {
				var o = JSON.parse(http.responseText);
				if (onSuccess) onSuccess(o)
			} else {
				if (onError) onError(http.status, http.responseText)
			}
		}
	}
	http.send();	//'data=' + dataJSON);
};

BACKEND.getClientTable = function(partnerId, tableId, onSuccess, onError) {
	/*
	var o = {
		'partnerId': partnerId,
		'tableId': tableId
	};
	BACKEND.GET('/api/users/clientTable', o, onSuccess, onError);
	*/
	BACKEND.GET('/api/users/clientTable/table/partnerId/' + partnerId + '/tableId/' + tableId + '', {}, onSuccess, onError);
	
};
BACKEND.getClientTableIds = function(partnerId, onSuccess, onError) {
	BACKEND.GET('/api/users/clientTable/tableIds/partnerId/' + partnerId, {}, onSuccess, onError);
};

BACKEND.getClientTables = function(partnerId, onSuccess, onError) {
	BACKEND.GET('/api/users/clientTable/tables/partnerId/' + partnerId, {}, onSuccess, onError);
};

BACKEND.getCurrentActions = function(partnerId, onSuccess, onError) {
	//BACKEND.GET('/api/users/clientTable/actions/partnerId/' + partnerId, {}, onSuccess, onError);
	BACKEND.GET('/api/actions/current/user/' + partnerId, {}, onSuccess, onError);
};

BACKEND.getExtras = function(partnerId, onSuccess, onError) {
	BACKEND.GET('/api/users/extras/partnerId/' + partnerId, {}, onSuccess, onError);
};

////////////////////////////////////////////////////////////////////////////////
