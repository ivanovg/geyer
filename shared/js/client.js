
function $(elId) {
	return document.getElementById(elId);
}

function put(txt) {
	console.log('client.js:\t' + txt);
}

var EL_DEBUG;
function debug(txt) {
	put(txt);
	/*
	if (EL_DEBUG === null) return;
	EL_DEBUG.innerHTML += txt + '\n';
	*/
}



function toId(s) {
	return s.trim();
}

function renderTable(tableId, o) {
	
	var tr = TABLE_RENDERER.renderTable(tableId, o, actions, SHOW_LEASE);
	
	return tr.html;
}




var MAX_ROWS = 99;
var MAX_COLS = 99;
var selectedRow = -1;
var selectedCol = -1;
var selectedTableId = -1;
var selectedExtras = [];
var extrasVisible = true;

function table_selectRow(tableId, iRow) {
	put('table_selectRow("' + tableId + '", ' + iRow + ')');
	selectedRow = iRow;
	
	for (var j = 0; j < MAX_ROWS; j++) {
		var elRow = $('table_' + tableId + '_row' + j);
		
		if (elRow === null) continue;
		if (j == iRow) {
			enable_buy_button(tableId, iRow, selectedCol);
			bf_button(tableId, iRow, selectedCol);
			elRow.classList.add('rowSelected');
		} else {
			elRow.classList.remove('rowSelected');
		}
		
		for (var i = 0; i < MAX_COLS; i++) {
			var elCell = $('table_' + tableId + '_row' + j + '_col' + i);
			
			if (elCell === null || elCell.classList.contains('empty')) continue;
			if ((j == iRow) || (iRow < 0)) {
				elCell.classList.remove('shimDown');
			} else {
				elCell.classList.add('shimDown');
			}
		}
	}
	//calculate();
}

function bf_button(tableId) {
	var elSurrounder = $('table_' + tableId + '_row' + 3 + '_col' + 1);
	// TODO:
	var elPrice = $('table_' + tableId + '_row' + 3 + '_col' + 1 + '_price');

	if(elPrice && elSurrounder){
		elSurrounder.classList.add('buy-me');
		elPrice.classList.add('buy-me-price');
	}
}

function enable_buy_button(tableId, iRow, iCol) {
	selectedRow = iRow;
	
	for (var j = 0; j < MAX_ROWS; j++) {		
		for (var i = 0; i < MAX_COLS; i++) {
			var elCell = $('table_' + tableId + '_row' + j + '_col' + i + '_link');
			
			if (elCell === null) continue;
			if (j == iRow && i == iCol) {
				elCell.classList.remove('disabled');
			} else {
				elCell.classList.add('disabled');
			}
		}
	}
	//calculate();
}

function table_selectCol(tableId, iCol) {
	put('table_selectCol("' + tableId + '", ' + iCol + ')');
	selectedCol = iCol;
	
	for (var j = 0; j < MAX_ROWS; j++) {
		for (var i = 0; i < MAX_COLS; i++) {
			var elCell = $('table_' + tableId + '_row' + j + '_col' + i);
			
			if (elCell === null || elCell.classList.contains("empty")) continue;

			if (i == iCol) {
				enable_buy_button(tableId, selectedRow, iCol);
				elCell.classList.add('colSelected');
				elCell.classList.remove('shimDown');
			} else {
				elCell.classList.remove('colSelected');
				elCell.classList.add('shimDown');
			}
			
			if (iCol < 0) {
				elCell.classList.remove('shimDown');
			}
			
		}
	}
	//calculate();
}
function table_selectCell(tableId, iRow, iCol) {
	put('table_selectCell("' + tableId + '", ' + iRow + ', ' + iCol + ')');
	selectedTableId = tableId;
	
	if ((iRow == selectedRow) && (iCol == selectedCol)) {
		// De-select when hitting it again
		//table_deselect(tableId);
		//calculate();
		//return;
	}
	enable_buy_button(tableId, iRow, iCol);
	table_selectRow(tableId, iRow);
	table_selectCol(tableId, iCol);
	
}
function table_deselect(tableId) {
	put('table_deselect()');
	table_selectRow(tableId, -1);
	table_selectCol(tableId, -1);
	selectedTableId = -1;
}

function renderExtras() {
	var el = $('extras');
	
	if (extrasVisible === true)
		el.style['display'] = 'block';
	else
		el.style['display'] = 'none';
	
	// Add HTML for extras
	if ((extras !== undefined) && (extras !== null) && (extras !== 0)) {
		r = '';
		
		//r += '<h1>Extras</h1>';
		//r += '<pre>' + JSON.stringify(extras, null, '\t') + '</pre>';
		//alert(JSON.stringify(extras, null, '\t'));
		
		//r += '<div class="table">';
		r += '<table class="table extras-table">';
		for (var i = 0; i < extras.table.length; i++) {
			if (selectedExtras.length <= i) selectedExtras.push(false);
			
			var elId = 'extra_check_' + i;
			
			var extra = extras.table[i];
			r += '<tr';

			// onselect

			r += '>';
			r += '<td style="text-align: center; padding-bottom:0px; padding-top:7px"';

            if (selectedExtras[i] === true) {
                r += ' onclick="extras_deselect(' + i + ');"';
            } else {
                r += ' onclick="extras_select(' + i + ');"';
            }

			r += '>';
			r += '<div class="checkbox checkbox-primary">';
			r += '<input type="checkbox"';
			r += ' id="' + elId + '"';
			if (selectedExtras[i] === true) {
				r += ' checked="checked"';
			}
			r += ' />';
			r += '<label for="' + elId +'" ></label>'
			r += '</div>'
			
			r += '</td>';
			
			r += '<th';

            if (selectedExtras[i] === true) {
                r += ' onclick="extras_deselect(' + i + ');"';
            } else {
                r += ' onclick="extras_select(' + i + ');"';
            }

			r += '>';
			r += '<label for="' + elId + '">' + extra.name + '</label>';
			r += '</th>';
			//r += '<td>' + extra.price + '</td>';
			
			price = extra.price;
			if (SHOW_LEASE > 0) {
				price /= SHOW_LEASE;
				//uvp /= SHOW_LEASE;
			}
			r += '<td class="calculate_price">' + formatPrice(price) + '&nbsp;€</td>';

			// info button
			r += '<td><a href="#!/mdrVideo"><i class="glyphicon glyphicon-info-sign"></i></a></td>'
			
			r += '</tr>';
		}
		r += '</table>';
		
		el.innerHTML = r;
	} else {
		put('No extras available.');
	}
}
function extras_select(extraId) {
	//alert('select extraId=' + extraId);
	selectedExtras[extraId] = true;
	//alert('selectedExtras=' + selectedExtras);
	renderExtras();
	calculate();
}

function extras_deselect(extraId) {
	selectedExtras[extraId] = false;
	renderExtras();
	calculate();
}

function extras_toggle() {
	extrasVisible = !extrasVisible;
	renderExtras();
}

function calculate() {
	var el = $('calculation');
	el.innerHTML = 'calculate: table=' + selectedTableId + ', row=' + selectedRow + ', col=' + selectedCol;
	el.style.display = 'none';
	var r = '';
	
	if ((selectedTableId < 0) || (selectedRow < 0) || (selectedCol < 0)) {
		r += 'Select a cell';
		el.innerHTML = r;
		return;
	}
	
	
	var tables = result.tables;
	var table = result.tables[selectedTableId];
	var row = table.rows[selectedRow];
	var dataRow = row.cells;	//.data[iRow];
	if (dataRow === undefined) dataRow = [];
	
	while (dataRow.length < table.columns.length) {
		dataRow.push(null);
	}
	var col = table.columns[selectedCol];
	var data = dataRow[selectedCol] || {
	};
	
	//el.innerHTML = '<pre>row=' + JSON.stringify(row) + '\n\ncol=' + JSON.stringify(col) + '\n\ndata=' + JSON.stringify(data) + '</pre>';
	//r += '<pre>table=' + JSON.stringify(table) + '</pre>';
	//r += '<pre>row=' + JSON.stringify(row) + '</pre>';
	//r += '<pre>col=' + JSON.stringify(col) + '</pre>';
	//r += '<pre>data=' + JSON.stringify(data) + '</pre>';
	
	var typ = data.type || 'info';
	if (typ != 'price') {
		r += 'Select a price cell';
		el.innerHTML = r;
		return;
	}
	
	var ekNetto = parseFloat(data.ek);
	var uvpBrutto = parseFloat(data.uvp);
	var vkBrutto = parseFloat(data.price);
	
	var vkTotal = vkBrutto;

	// TODO LEASE!!!!!!!!!!!!
	var lease = 1;
	if (SHOW_LEASE > 0) lease = SHOW_LEASE;
	
	
	//data.text
	r += '<table class="table col-xs-12">';
	
	r += '<tr>';
	r += '<th>';
	r += table.name;
	r += '</th>';
	r += '<td>';
	r += col.title;
	r += ' ';
	r += row.title.join('\n');
	r += '</td>';
	
	r += '<td class="calculate_price">';
	//r += 'UVP ' + formatPrice(uvpBrutto) + '&nbsp;€';
	
	r += '<strike>UVP ' + formatPrice(uvpBrutto) + '&nbsp;€</strike><br />';
	r += '' + formatPrice(vkBrutto) + '&nbsp;€';
	
	r += '</td>';
	r += '</tr>';
	
	
	// Check for actions
	if (actions !== 0) {
		for (var ai in actions) {
			var a = actions[ai];
			put('Checking action #' + ai + '...');
			// Check if the action applies right now
			if (augenglueck_checkAction(a) === false) continue;
			
			for (var afi = 0; afi < a.fields.length; afi++) {
				var af = a.fields[afi];
				
				// This action seems to have constraints for the current table
				if (af.name == table.name) {
					
					//put('Found action that fits!');
					var action = af;
					
					var aValue = action.rows[selectedRow].cells[selectedCol];
					
					if (aValue.einheit !== ACTION_UNIT_NONE) {
						//put('We have an action value!');
						
						
						
						var actionUnit = aValue.einheit;
						var actionValue = parseFloat(aValue.wert);
						
						var actionPriceResult = CALCULATE_PRICE.getActionDiscount(ekNetto, uvpBrutto, vkBrutto, actionUnit, actionValue);
						//r += '<pre>actionPriceResult=' + JSON.stringify(actionPriceResult) + '</pre>';
						
						r += '<tr>';
						
						r += '<th>';
						r += 'Aktion';
						r += '</th>';
						
						r += '<td>';
						r += a.title;
						//r += ': ';
						//r += actionValue + ' ' + actionUnit + ' günstiger';
						r += '</td>';
						
						r += '<td class="calculate_price">';
						//r += '−' + formatPrice(actionPriceResult.discountTotal) + '&nbsp;€';
						if (actionUnit == ACTION_UNIT_TOTAL) {
							r += '−&nbsp;' + formatPrice(actionValue) + '&nbsp;€';
						} else {
							r += '−&nbsp;' + (actionValue) + '%';
						}
						r += '</td>';
						
						r += '</tr>';
						
						vkTotal = parseFloat(actionPriceResult.vk);
						
						// There can only be one!
						break;
						
					}
				}
			}
			
		}
	}
	
	// Extras
	for (var i = 0; i < extras.table.length; i++) {
		if (selectedExtras.length <= i) continue;
		if (selectedExtras[i] === false) continue;
		
		var extra = extras.table[i];
		var extraPrice = parseFloat(extra.price);
		r += '<tr>';
		r += '<th>';
		r += extra.name;
		r += '</th>';
		
		r += '<td>';
		r += '</td>';
		
		r += '<td class="calculate_price">';
		r += '+&nbsp;' + formatPrice(extraPrice) + '&nbsp;€';
		r += '</td>';
		r += '</tr>';
		
		vkTotal += extraPrice;
		
	}
	
	
	r += '<tr class="calculate_final">';
	r += '<th>';
	r += 'Gesamt';
	r += '</th>';
	
	r += '<td>';
	r += '</td>';
	
	r += '<td class="calculate_price">';
	r += formatPrice(vkTotal) + '&nbsp;€';
	r += '</td>';
	r += '</tr>';
	
	
	if (lease > 1) {
		var vkLease = vkTotal / lease;
		
		r += '<tr>';
		r += '<th>';
		r += 'Raten';
		r += '</th>';
		
		r += '<td>';
		r += lease + ' Monate';
		r += '</td>';
		
		r += '<td class="calculate_price">';
		r += 'á&nbsp;' + formatPrice(vkLease) + '&nbsp;€';
		r += '</td>';
		r += '</tr>';
	}
	
	el.innerHTML = r;
	
	
	el.style.display = 'block';
	
}


/*
function init() {
	put('init()...');
	EL_DEBUG = $('debug');
}

//init();
window.onload = init;
*/