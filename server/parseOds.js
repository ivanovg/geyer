/*
	Server-side backend module, fetching all the data
*/
var PARSE_ODS = {
	REVISION: '1'
};

var AdmZip = require('adm-zip');

function put(txt) {
	//SERVER.put('backend.js:\t' + txt);
	console.log('parseOds.js:\t' + txt);
	return txt;
}


PARSE_ODS.parseOds = function(buffer, onParsed) {
	put('parseOds:	Unzipping...');
	var zip = new AdmZip(buffer);
	
	var zipEntries = zip.getEntries(); // an array of ZipEntry records
	/*
	zipEntries.forEach(function(zipEntry) {
		console.log(zipEntry.toString()); // outputs zip entries information
		/ *
		if (zipEntry.entryName == 'meta.xml') {
			console.log(zipEntry.data.toString('utf8')); 
		}
		* /
	});
	*/
	// outputs the content of some_folder/my_file.txt
	//console.log(zip.readAsText('content.xml')); 
	
	put('parseOds:	Reading XML contents...');
	var contentXmlData = zip.readAsText('content.xml');
	console.log('contentXmlData: ' + contentXmlData); 
	
	var xml2js = require('xml2js');
	var parser = new xml2js.Parser();
	put('parseOds:	Parsing XML structure...');
	parser.parseString(contentXmlData, function (err, result) {
		//console.dir(result);
		
		var r = {
			'tables': []
		};
		
		
		put('parseOds.parser:	Document-content...');
		var content = result['office:document-content'];
		var bodys = content['office:body'];
		//console.dir(bodys);
		var body = bodys[0];
		
		put('parseOds.parser:	Spreadsheet...');
		var sss = body['office:spreadsheet'];
		//console.dir(sss);
		
		
		var ss = sss[0];
		
		put('parseOds.parser:	Table(s)...');
		var tables = ss['table:table'];
		//console.dir(tables);
		
		for (var iTable in tables) {
			var rTable = {
				'name': '',
				'columns': [],
				'rows': []
			};
			
			var table = tables[iTable];
			rTable.name = table['$']['table:name'];
			
			var cols = table['table:table-column'];
			
			var rows = table['table:table-row'];
			var maxCols = 0;
			//console.dir(rows);
			put('parseOds.parser:	Rows...');
			for (var rowI in rows) {
				var rrow = {
					'title': '',
					'cells': []
				};
				
				var row = rows[rowI];
				//console.dir(row);
				var cells = row['table:table-cell'];
				
				for (var cellI in cells) {
					var cell = cells[cellI];
					
					//console.log('R' + (rowI) + ' C' + (cellI) + JSON.stringify(cell));
					
					var cellRepeat = 1;
					if (cell['$'] !== undefined) {
						cellRepeat = cell['$']['table:number-columns-repeated'] || 1;
					}
					//console.log('Repeat=' + cellRepeat);
					
					
					for (var repeatI = 0; repeatI < cellRepeat; repeatI++) {
						var texts = cell['text:p'] || [];
						//console.dir(texts);
						var cellData = [];
						
						for (var textI in texts) {
							var text = texts[textI];
							if (typeof text == 'string') {
								//console.log('"' + text + '"');
								cellData.push(text);
								
							} else {
								
								cellData.push(JSON.stringify(text));
								/*
								var spans = text['text:span'] || [];
								for (var spanI in spans) {
									var span = spans[spanI];
									//console.dir(span);
									//var styleName = span['$']['text:style-name'];
									
									text = span['_'];
									//console.dir(text);
									cellData.push(text);
								}
								*/
								
							}
						}
						
						
						// Post-process cell:
						//@TODO: Depending on the STYLE used: Mark it as "info", "price", ...
						var rcell = {
							'type': 'invalid',
							'text': '',
						};
						
						// Text cell?
						var isText = false;
						
						if (cellData.length == 0) {
							rcell.type = 'empty';
						
						} else {
							
							
							
							// Check if it is a price table (srtarts with idetifier)
							var priceCellIdentifier = 'vk';	// What to look for
							if (cellData[0].trim().substr(0, priceCellIdentifier.length).toLowerCase() == priceCellIdentifier) {
								// Yes, it is a price cell!
								isText = false;
								
								rcell.type = 'price';
								//rcell.price = cellData[0].substr(6).trim();
								//rcell.uvp = cellData[1].substr(4).trim();
								//rcell.ek = cellData[2].substr(3).trim();
								
								rcell.price = 0;
								rcell.uvp = 0;
								rcell.ek = 0;
								rcell.marge = 0;
								
								// Parse attributes of a price cell
								for (var pii in cellData) {
									var pid = cellData[pii].trim();
									var pikv = pid.split(':');
									var pik = pikv[0].trim().toLowerCase();
									
									if (pik == 'vk')	pik = 'price';
									
									var piv = pikv[1].trim();
									rcell[pik] = piv;
								}
								
							} else {
								// Cannot identify as "price", so it is text
								isText = true;
							}
						}
						
						
						if (isText) {
							rcell.type = 'text';
							rcell.text = [cellData.join('\n')];
						}
						
						
						rrow.cells.push(rcell);
					} // end of cellRepeat
				}
				
				// Remove first cell as title
				rrow.title = rrow.cells[0].text;
				//delete rrow.cells[0];
				rrow.cells.shift();
				
				rTable.rows.push(rrow);
				
				if (rrow.cells.length > maxCols) maxCols = rrow.cells.length;
			}
			
			//put(JSON.stringify(rTable), null, '\t');
			
			// Post-process:
			put('parseOds.parser:	Post-processing...');
			//console.log(JSON.stringify(r.rows[0], null, '\t'));
			
			// Add column titles
			for (var i = 0; i < maxCols; i++) {
				rTable.columns.push({
					//'type': 'head',
					'title': rTable.rows[0].cells[i].text
				});
			}
			// Remove first row as title
			//delete r.rows[0];
			rTable.rows.shift();
			
			//put(JSON.stringify(rTable), null, '\t');
			
			r.tables.push(rTable);
		}
		
		put('parseOds.parser:	done.');
		if (onParsed !== undefined) {
			onParsed(r);
		}
		
	});

};


////////////////////////////////////////////////////////////////////////////////

module.exports = PARSE_ODS;