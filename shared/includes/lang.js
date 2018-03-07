/* ######## Begin of auto-generated languages ######## */

/* DO NOT ALTER THIS FILE! IT IS AUTO-GENERATED! ALL CHANGES MADE MANUALLY WILL BE OVERWRITTEN ON NEXT AUTO-GENERATION OF THIS FILE! CHANGE THE SOURCE FILE "lang.csv" INSTEAD! */

var lang = {REVISION: '1'};
lang.isos = ["de_DE","en_US"];
function stringFormat(s, args) {
	return s.replace(/{(d+)}/g, function(match, number) { 
		return (	(typeof args[number] != "undefined") ? args[number] : match	);
	});
}
function langResolve(langISO, langId, p1, p2, p3, p4) {
	var r = null;
	if (langId[0] == "{") {
		// Inline lang tuple
		var l = JSON.parse(langId);
		r = l[langISO];
		if (r === undefined) {
			r = "(langId=" + langId + ")";
		}
	}
	else
	switch(langISO) {
		case "de_DE":
			switch(langId) {
				case "hello":	r = "Hallo!"; break;
			}
			break;
			
		case "en_US":
			switch(langId) {
				case "hello":	r = "Hi!"; break;
			}
			break;
			
	}
	if (r === null) {
		r = '{' + langISO + '? : ' + langId + '?}';
	} else {
		r = stringFormat(r, [p1, p2, p3, p4]);
	}
	return r;
}
lang.resolve = langResolve;
if (typeof module === 'object') {
	module.exports = lang;
}
/* ######## End of auto-generated languages ######## */

