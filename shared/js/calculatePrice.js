/*
	
	Put all your pricing bullshit here!
	
*/

var CALCULATE_PRICE = {
};

var VAT = 0.19;
var ACTION_UNIT_PERCENT = '%';
var ACTION_UNIT_TOTAL = 'EUR';	//'�';

CALCULATE_PRICE.parsePrice = function(t) {
	t = t + '';
	t = t.replace(',-', '.00');
	t = t.replace(',', '.');
	var f = parseFloat(t);
	return f;
};

CALCULATE_PRICE.formatPrice = function(v) {
	return Math.round(v*100)/100;
};

CALCULATE_PRICE.getNetto = function(brutto) {
	return brutto / (1.0 + VAT);
};



CALCULATE_PRICE.getMasterDiscount = function(ek, uvp, vk) {
	// Berechnet den Rabatt in % bei Eingabe von EK/UVP/VK
	
	/*
	Info:
		ek ist in netto
		vp ist in brutto
		vk ist in brutto
	
	*/
	
	var vkBrutto = vk;
	var uvpBrutto = uvp;
	
	var ekNetto = ek;
	var vkNetto = this.getNetto(vkBrutto);
	var uvpNetto = this.getNetto(uvpBrutto);
	
	
	// Aktionsrabatt: soll sich auf den UVP beziehen
	var margeNetto = vkNetto - ekNetto;
	
	
	//Berechne den Aktionsrabatt:
	//	wenn uvp < vk --> mache nichts
	//	wenn uvp > vk --> 
	var discountTotal = uvpBrutto - vkBrutto;
	var discountPercent = discountTotal / uvpBrutto;
	
	
	return {
		'text':
			'Rechnung: ' + uvpBrutto + ' € UVP (brutto)'
			+ ' - ' + vkBrutto + ' € VK (brutto)'
			+ ' = ' + discountTotal + ' € Rabatt '
			+ ' = ' + (discountPercent*100) + '% von ' + uvpBrutto + ' € UVP (brutto)',
		
		'margeNetto': margeNetto,
		'discountTotal': discountTotal,
		'discountPercent': discountPercent,
		'VAT': VAT
	};
};


CALCULATE_PRICE.getActionDiscount = function(ek, uvp, vk, actionUnit, actionValue) {
	
	//alert('getActionDiscount(ek=' + ek + ', uvp=' + uvp + ', vk=' + vk + ', actionUnit=' + actionUnit + ', actionValue=' + actionValue + ')');
	
	var ekNetto = ek; 
	
	var vkNeu = vk;
	var margeNetto = 0;
	
	actionValue = parseFloat(actionValue);
	
	
	if (actionUnit == ACTION_UNIT_TOTAL) {
		
		// OPTION 1: Rabatt bezieht sich auf den VK
		//vkNeu = vk - actionValue;
		
		// OPTION2: Rabatt bezieht sich auf den UVP (siehe FS#125, E-Mail von Joachim 2017-04-19)
		vkNeu = uvp - actionValue;
		
	} else 
	if (actionUnit == ACTION_UNIT_PERCENT) {
		
		// OPTION 1: Rabatt bezieht sich auf den VK
		//vkNeu = vk - ((vk/100)*actionValue);
		
		// OPTION 2: Rabatt bezieht sich auf den UVP (siehe FS#125, E-Mail von Joachim 2017-04-19)
		vkNeu = uvp - ((uvp/100)*actionValue);
		
	} else {
		alert('Unknown action unit "' + actionUnit + '"!');
	}
	
	//aktionsrabattNeu
	var discountTotal = uvp - vkNeu;
	discountPercent = discountTotal / uvp;
	
	
	//berechne die NettoMarge
	var vkNeuNetto = this.getNetto(vkNeu);
	margeNetto = vkNeuNetto - ekNetto;
	margeNetto = this.formatPrice(margeNetto);
	var margeNettoText = 'VK neu (netto) ' + this.formatPrice(vkNeuNetto) + ' Euro - EK (netto) ' + this.formatPrice(ekNetto) + ' Euro';
	
	var r = {
		'vk': vkNeu,
		'vkNetto': vkNeuNetto,
		'margeNetto': margeNetto,
		'margeNettoText': margeNettoText,
		'discountTotal': discountTotal,
		'discountPercent': discountPercent,
		'VAT': VAT
	};
	
	//alert('getActionDiscount(ek=' + ek + ', uvp=' + uvp + ', vk=' + vk + ', actionUnit=' + actionUnit + ', actionValue=' + actionValue + ') = \n' + JSON.stringify(r));
	
	return r;
};


CALCULATE_PRICE.getVk = function(uvp, ek, aktionsrabatt) {
	// Berechnet den VK anhand von UCP und dem Rabatt in Prozent, den man gibt (z.B. "ich bin immer 10% g�nstiger als der UVP")
	
	var rabattBrutto = (uvp / 100) * aktionsrabatt;
	var vkBrutto = uvp - rabattBrutto;
	
	/*
	//vk berechnen
	var einProzentDesUVP = uvp / 100;
	var rabattInEuro = aktionsrabatt * einProzentDesUVP;
	
	rabattInEuro = parseFloat(rabattInEuro);
	uvp = parseFloat(uvp);
	
	var vk = rabattInEuro + uvp;
	*/
	vkBrutto = this.formatPrice(vkBrutto);
	
	
	
	//NettoMarge berechnen
	//berechne die NettoMarge
	var vkNetto = this.formatPrice(this.getNetto(vkBrutto));
	var ekNetto = ek; 
	
	var margeNetto = this.formatPrice(vkNetto - ekNetto);
	
	var priceResult = {
		'text':
			'Rechnung: ' + this.formatPrice(uvp) + ' € UVP (brutto)'
			+ ' − ' + aktionsrabatt + '% (' + this.formatPrice(rabattBrutto) + ' €)'
			+ ' = ' + this.formatPrice(vkBrutto) + ' € VK (brutto) / ' + this.formatPrice(vkNetto) + ' € VK (netto)',
		'vkBrutto': vkBrutto,
		'margeNetto': margeNetto
	};
	return priceResult;
}