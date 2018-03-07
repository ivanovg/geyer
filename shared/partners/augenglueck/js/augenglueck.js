//var partnerId = 'berta@brillenbude.de';
//var partnerId = 'demo';
var partnerId = 'info@optikstudio-geyer.de';
var result = 0;
var actions = 0;
var extras = 0;
var SHOW_LEASE = 0;
var ACTION_TYPE_PDF = 'FASSUNG';

var staticContents = [];	// List of static menu items

//function put(txt) {	console.log(txt);}

function show_lease(months) {
	SHOW_LEASE = months;
	augenglueck_renderTables(1);
}

function augenglueck_refresh(index) {
	augenglueck_fetchTables();
	augenglueck_fetchActions();
	augenglueck_fetchExtras(index);
}

function augenglueck_fetchActions() {
	put('Fetching actions...');
	
	BACKEND.getCurrentActions(partnerId,
	function(o) {
			//put('getCurrentActions Result: ' + JSON.stringify(o));
			//console.log("calling actions");
			actions = o.actions;
			augenglueck_renderTables(0);
			//augenglueck_renderNavi();	// Some actions have their own menu items
	},
	function(e) {
		console.log('Error while getClientTable: ' + JSON.stringify(e));
	});
}


function augenglueck_fetchExtras(index) {
	put('Fetching extras...');
	
	
	BACKEND.getExtras(partnerId,
	function(o) {
			put('getExtras Result: ' + JSON.stringify(o));
			//console.log("calling extras");
			extras = o;	//.extras;
			augenglueck_renderTables(index);
	},
	function(e) {
		console.log('Error while getExtras: ' + JSON.stringify(e));
	});
	
	
	/*
	//@FIXME: Just for testing
	extras = {
		"email": "info@test.de",
		"table": [
		 {"name": "Mittendichtenreduktion", "price": 72},
		 {"name": "Antistatik-Beschichtung", "price": 24},
		 {"name": "Standardfarben-FunColor", "price": 48},
		]
	};
	augenglueck_renderTables();
	*/
	

}


function augenglueck_fetchTables() {
	var tableId = 0;
	
	put('Fetching clientTables...');
	
	BACKEND.getClientTables(partnerId,
	function(o) {
			//put('getClientTables Result: ' + JSON.stringify(o));
			//console.log("calling clients");
			result = o;
			augenglueck_renderTables(1);
			//augenglueck_renderNavi();
	},
	function(e) {
		put('Error while getClientTables: ' + JSON.stringify(e));
	});
}

function augenglueck_renderTables(tableIndex) {
	var el = document.getElementById('content');
	if (el == null){
		return;
	}
	el.innerHTML = '';
	var r = '';

	// // Render pricing tables
	var mapping = ["Arbeitsplatz", "Einstärken", "Gleitsicht"];
	
	tableIndex = result.tables.map(x => x.name).indexOf(mapping[tableIndex]);
	var table = result.tables[tableIndex];

	
	selectedRow = -1;
	selectedCol = -1;
	selectedTableId = -1;
		
	r = '';
	r += '<a name="table' + tableIndex + '" title="' + table.name + '"></a>';
	r += '<div class="table">';
	r += renderTable(tableIndex, table);
	r += '</div>';
		
	el.innerHTML += r;
	
	// Render action PDFs
	for (var ai in actions) {
		var a = actions[ai];
		put('Checking action #' + ai + ' / ' + (actions.length) + '...');
		
		// Check if the action applies right now
		//if (augenglueck_checkAction(a) === false) continue;
		
		if (a.filepath != '') {	// Is it a "PDF action"?
			//if (a.type == ACTION_TYPE_PDF) {
			//a.color == ''
			
			//var partnerId = ... // This is known globally
			// Determine fileId
			var p = a.filepath.lastIndexOf('/');
			if (p > 0) {
				var fileId = a.filepath.substr(p+1);
				
				r = '';
				r += '<a name="action' + ai + '" title="' + a.title + '"></a>';
				r += '<div class="action">';
				
				//r += '<pre>TODO: Show PDF: filepath="' + a.filepath + '", fileId="' + fileId + '"</pre>';
				var url = '/js/getPartnerFile.ssjs?partnerId=' + partnerId + '&fileId=' + fileId;
				
				url += '#page=1&view=FitH&zoom=100&scrollbar=0&toolbar=0&navpanes=0&border=0';
				
				r += '<object';
				r += ' class="pdf"';
				r += ' type="application/pdf"'
				r += ' trusted="yes"';
				//r += ' application="yes"';
				r += ' width="100%"';
				//r += ' data="' + url + '#view=FitH&zoom=100"';
				r += ' data="' + url + '"';
				r += '>';
				//r += '<param name="view" value="FitH" />';
				//r += '<param name="zoom" value="100" />';
				//r += '<param name="scrollbar" value="0" />';
				//r += '<param name="toolbar" value="0" />';
				//r += '<param name="navpanes" value="0" />';
				
				r += 'PDF cant be rendered';
				r += '</object>';
				/*
				r += '<iframe';
				r += ' src="' + url + '"';
				r += ' width="" height=""';
				r += ' border="0"';
				r += ' class="pdf"';
				r += '>';
				r += '</iframe>';
				*/
				r += '</div>';
				el.innerHTML += r;
			}
			
		}
	}
	
	table_selectRow(selectedTableId, selectedRow);
	table_selectCol(selectedTableId, selectedCol);
	bf_button(tableIndex);
	//calculate();
}

function augenglueck_renderExtraTable(){
	var el = document.getElementById('content');
	// Render extras (container)
	r = '';
	r += '<div class="extras col-sm-5" id="extras"';
	//r += ' onclick="document.getElementById(\'extras\').style.display = \'none\';"';
	r += '>\n';
	r += '</div>';
	el.innerHTML += r;

	renderExtras();
	calculate();
}

function augenglueck_renderCalculationTable(){
	var el = document.getElementById('content');

	// Show price calculation
	r = '';
	r += '<div class="calculation" id="calculation"';
	//r += ' onclick="$(\'calculation\').style.display = \'none\';"';
	r += '>\n';
	r += 'Calculation';
	r += '</div>';
	r += '\n';
	el.innerHTML += r;

	calculate();
}


function augenglueck_renderNavi() {
	var el = document.getElementById("nav_content_list");
	var r = '';
	var LF = '\n';
	
	if (staticContents.length > 0) {
		r += '<ul class="nav_content_statics">' + LF;
		for (var sci in staticContents) {
			var sc = staticContents[sci];
			var title = sc["title"];
			var anchorName = sc["name"];
			r += '<li>';
			r += '<a href="#' + anchorName + '">' + title + '</a>';
			r += '</li>' + LF;
		}
		r += '</ul>' + LF;
	}
	
	if (result.tables.length > 0) {
		r += '<ul class="nav_content_tables">' + LF;
		for (var iTable in result.tables) {
			var table = result.tables[iTable];
			r += '<li>';
			r += '<a href="#table' + iTable + '">' + table.name + '</a>';
			r += '</li>' + LF;
		}
		r += '</ul>' + LF;
	}
	
	// Aktionen
	if ((actions !== 0) && (actions.length > 0)) {
		//alert(JSON.stringify(actions, null, '\t'));
		
		r += '<ul class="nav_content_actions">' + LF;
		for (var ai in actions) {
			var a = actions[ai];
			//put('Rendering navi for action #' + ai + '...');
			
			// Check if the action applies right now
			//if (augenglueck_checkAction(a) === false) continue;
			
			//if (a.fields.length > 0) {
			//	// Action with contraints on tables. We don't need that.
			//} else
			if (a.filepath != '') {	// Is it a "PDF action"?
				//if (a.type == ACTION_TYPE_PDF) {
				// PDF action: Show in menu
				//a.color == ''
				
				r += '<li>';
				r += '<a href="#action' + ai + '">' + a.title + '</a>';
				r += '</li>' + LF;
			}
		}
		r += '</ul>' + LF;
	}
	
	//r += '</ul>' + LF;
	el.innerHTML = r;
}



function augenglueck_onInit(index) {
	augenglueck_fetchTables();
	augenglueck_fetchActions();
	augenglueck_fetchExtras(index);
	
	// Scan HTML for static items
	var className = "static_content";
	var els = document.getElementsByClassName(className);
	//alert(els);
	staticContents = [];
	for (var elsi in els) {
		var el = els[elsi];
		//alert(el.innerHTML);
		if ((el.tagName == "A") && (el.getAttribute("handled") != 1)) {
			el.setAttribute("handled", "1");
			var title = el.title;
			//var anchorName = el.getAttribute("name");
			var name = el.getAttribute("name");
			//alert(name);
			
			var sco = getElementOffset(el);
			
			staticContents.push({
				'title': title,
				'name': name,
				'el': el
			});
		}
	}
}


function getElementOffset(el) {
	var _x = 0;
	var _y = 0;
	var _width = el.offsetWidth;
	var _height = el.offsetHeight;
	while(el && !isNaN(el.offsetLeft ) && !isNaN(el.offsetTop ) ) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return {x: _x, y: _y, width: _width, height:_height};
}
function augenglueck_onScroll(event) {
	var pageX = window.pageXOffset;
	var pageY = window.pageYOffset;
	var pageWidth = window.innerWidth;
	var pageHeight = window.innerHeight;
	
}
function augenglueck_scroll(event) {
	var pageY = window.pageYOffset;
	//put(pageY);
	
	// Find next scroll mark!
	/*
	var pageSize = 400;
	var nextY = Math.round(pageY / pageSize) * pageSize;
	*/
	
	var nextY = pageY;
	var bestDeltaY = 99999;
	for (var sci in staticContents) {
		var sc = staticContents[sci];
		
		//var scy = sc.pageY;
		// Get page offset
		var sco = getElementOffset(sc.el);
		var scy = sco.y;
		
		var deltaY = Math.abs(pageY - scy);
		if (deltaY < bestDeltaY) {
			bestDeltaY = deltaY;
			nextY = scy;
		}
	}
	//put(bestDeltaY);
	
	var ratio = 0.99;
	pageY = pageY * ratio + (1.0-ratio) * nextY;
	//window.pageYOffset = pageY;
	//window.scrollTo(0, nextY);
	window.scrollTo(0, pageY);
}
window.onload = augenglueck_onInit(0);
//window.onscroll = augenglueck_onScroll;
//setInterval(augenglueck_scroll, 20);