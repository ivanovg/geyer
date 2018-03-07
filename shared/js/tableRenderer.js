var TABLE_RENDERER = {
};


var ACTION_UNIT_NONE = '?';
var ACTION_UNIT_PERCENT = '%';
var ACTION_UNIT_TOTAL = 'EUR';	//'�';

function put(txt) {
	//console.log('tableRenderer.js: ' + txt);
}

function formatText(text) {
	var r = text || '';
	
	if (typeof r == 'object') {
		// Join array items line-wise
		r = r.join('\n');
	}
	
	if (typeof r == 'string') {
		// CRs
		r = r.replace(/\n/g, '<br />\n');
	}
	return r;
}


function formatPrice(v) {
	
	var vFull = Math.floor(v);
	var vFrac = Math.floor((v - vFull) * 100);
	
	var r = '' + (vFull);
	
	r += ',';
	
	var tFrac = '' + (vFrac);
	if (tFrac == '0') tFrac = '-';
	else if (tFrac.length < 2) tFrac += '0';
	else if (tFrac.length > 2) tFrac = tFrac.substr(0, 2);
	
	r += tFrac;
	
	return r;
}

function formatPercent(fraction) {
	var r = Math.round(fraction * 100) + '%';
	return r;
}


TABLE_RENDERER.renderTable = function(tableId, o, actions, SHOW_LEASE) {
	
	var r = '';
	var LF = '\n';
	//alert(JSON.stringify(o, null, '\t'));
	
	//var tableId = toId(o.name);
	
	
	
	r += '<table class="prices" id="table_' + tableId + '">' + LF;
	
	// Render head of table
	r += '	<thead>' + LF;
	r += '		<tr>' + LF;
	
	var text = o.name;
	var html = formatText(text);
	r += '			<th class="plain"';
	r += ' onclick="table_deselect(\'' + tableId + '\')"';
	r += '>' + html + '</th>' + LF;
	
	for (var iCol in o.columns) {
		var col = o.columns[iCol];
		var typ = col.type || 'head';
		var text = col.title;
		var html = formatText(text);
		r += '			<th class="' + typ + '"';
		r += ' id="table_' + tableId + '_col' + iCol + '"';
		r += ' onclick="table_selectCol(\'' + tableId + '\', ' + iCol + ');"';
		r += '>' + html + '</th>' + LF;
	}
	r += '		</tr>' + LF;
	r += '	</thead>' + LF;
	
	
	// Render the body
	r += '	<tbody>' + LF;
	
	var count = 0;
	for (var iRow in o.rows) {
		var row = o.rows[iRow];
		
		r += '		<tr id="table_' + tableId + '_row' + iRow + '">' + LF;
		
		var text = row.title;
		var html = formatText(text);
		r += '			<th class="info"';
		r += ' onclick="table_selectRow(\'' + tableId + '\', ' + iRow + ');"';
		r += '>' + html + '</th>' + LF;
		
		var dataRow = row.cells;	//.data[iRow];
		if (dataRow === undefined) dataRow = [];
		while (dataRow.length < o.columns.length) {
			dataRow.push(null);
		}
		
		for (var iCol in o.columns) {
			var data = dataRow[iCol] || {};
			
			var text = data.text;
			var typ = data.type || 'info';
				
			if ((data.text == undefined) && (data.type == undefined)) typ = 'empty';
			
			var html;
			switch(typ) {
				case 'empty':
					html = '';
					break;
				
				case 'price':
					
					var lease = 1;
					if (SHOW_LEASE > 0) lease = SHOW_LEASE;
					
					var ekNetto = parseFloat(data.ek);
					var uvpBrutto = parseFloat(data.uvp);
					var vkBrutto = parseFloat(data.price);
					
					
					var isAction = false;
					var aValue = 0;
					
					// Check each action for each cell! Yeeha!
					if (actions !== 0) {
						for (var ai in actions) {
							var a = actions[ai];
							
							//put('Checking action #' + ai + ' "' + af.name + '"...');
							//put('Checking action #' + ai + ' = ' + JSON.stringify(a) + '"...');
							put('Checking action #' + ai + '...');
							// Check if the action applies right now
							//if (augenglueck_checkAction(a) === false) continue;
							
							if (a.fields.length > 0) {
								
								// Check all tables of this action...
								for (var afi = 0; afi < a.fields.length; afi++) {
									var af = a.fields[afi];
								
									if (af.name == o.name) {
										//put('Found action that fits!');
										
										// Check if the field in this action apply to this cell...
										aValue = af.rows[iRow].cells[iCol];
										if ((aValue !== null) && (aValue.einheit !== ACTION_UNIT_NONE)) {
											put('We have an action value for cell row=' + iRow + ', col=' + iCol + '!');
											isAction = true;
											
											typ += ' action';	// add style class!
											// There can only be one active action per table!
											break;
										}
										
									}
								}
							}
							
						}
					}	
								
					if (isAction) {
						var actionUnit = aValue.einheit;
						var actionValue = aValue.wert;
						
						var actionPriceResult = CALCULATE_PRICE.getActionDiscount(ekNetto, uvpBrutto, vkBrutto, actionUnit, actionValue);
						
						//alert('actionPriceResult:\n' + JSON.stringify(actionPriceResult));
						vkBrutto = actionPriceResult.vk;
						//priceResult.margeNetto
						//priceResult.discountPercent
					}
					
					
					html = '';
					
					if (vkBrutto > 0) {
						html += '<span class="augenglueck">AUGENGLÜCK<sup>PLUS</sup></span>';
						
						html += "<span id='table_" + tableId + '_row' + iRow + "_col" + iCol + "_price' class=\"bigger animate delay" + (iCol) + "\">" + formatPrice(vkBrutto / lease) + '&nbsp;€</span>';
					}
					
					
					if (isAction) {
						
						var rabatt = '';
						if (aValue.einheit == ACTION_UNIT_TOTAL){
							rabatt = formatPrice(actionPriceResult.discountTotal / lease) + '&nbsp;€';
						
						} else if (aValue.einheit == ACTION_UNIT_PERCENT){
							rabatt = formatPercent(actionPriceResult.discountPercent / lease);
						} else {
							html += '<strong>Unknown action unit "' + aValue.einheit + '"!</strong>';
						}
						
						//html += '<br /><strong>AKTION!<br />' + (rabatt) + ' günstiger als UVP!</strong>';
						
						if (actionPriceResult.discountTotal > 0) {
							html += '<strong>' + (rabatt) + ' günstiger als UVP!</strong>';
						} else {
							html += '<strong>' + (rabatt) + ' (teurer) als UVP!</strong>';
						}
						html += '<br />';
					}
					
					if (uvpBrutto > vkBrutto) html += '<span class="uvp">UVP HERSTELLER ' + formatPrice(uvpBrutto / lease) + '&nbsp;€</span>';
					html += "<a style=\"font-size: 14px;\" class='disabled btn cartbutton' id='table_" + tableId + '_row' + iRow + "_col" + iCol + "_link' href='#!/orderOptions' " +
						"ng-click='isAuction(" + typ +")'> Auswählen</a>";
					
					count++;
					break;
				
				default:
					html = formatText(text);
			}
			
			r += '			<td class="' + typ + '"';
			r += ' id="table_' + tableId + '_row' + iRow + '_col' + iCol + '"';
			r += ' onclick="table_selectCell(\'' + tableId + '\', ' + iRow + ', ' + iCol + ');"';
			r += ' onclick="table_selectCell(\'' + tableId + '\', ' + iRow + ', ' + iCol + ');"';
			r += '>' + html + '</td>' + LF;
		}
		
		r += '		</tr>' + LF;
	}
	
	r += '	</tbody>' + LF;
	
	r += '</table>' + LF;
	
	
	
	return {
		'html': r
	};
};
