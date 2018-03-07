//
var MAX_ITEMS = 10;

function compareInit() {
	compareSwitch('left', 0);
	compareSwitch('right', 0);
	
	// Pre-load all items
	var el;
	var elId;
	var i;
	var r = '';
	var itemFile = '';
	for (var iside = 0; iside < 2; iside++) {
		var side = ((iside == 0) ? 'left' : 'right');
		for (i = 0; i < MAX_ITEMS; i++) {
			elId = 'textMenuItem_' + side + '_' + (i);
			el = document.getElementById(elId);
			if (!el) break;	// Enough
			itemFile = el.getAttribute('data-file')
			
			r += '<img class="comprePreload" src="media/' + itemFile + '" />';
		}
	}
	el = document.getElementById('comparePreload');
	el.innerHTML = r;
}

function menuSwitch(side, itemNum) {
	var elId;
	var el;
	var i;
	var itemFile = '';
	
	// Update menu items
	for (i = 0; i < MAX_ITEMS; i++) {
		elId = 'textMenuItem_' + side + '_' + (i);
		el = document.getElementById(elId);
		if (!el) break;	// Enough
		if (i == itemNum) {
			el.classList.add('selected');
			//itemText = el.innerText.trim();
			itemFile = el.getAttribute('data-file')
		} else {
			el.classList.remove('selected');
		}
	}
	return itemFile;
}


function compareSwitch(side, itemNum) {
	var elId;
	var el;
	var i;
	var itemFile = '';
	
	// Update menu items
	itemFile = menuSwitch(side, itemNum);
	
	// Change content
	
	//var fileName = 'media/compare_' + itemText + '.png';
	//var fileName = 'media/compare_' + itemText + '.png';
	var fileName = 'media/' + itemFile;
	elId = 'compareBackground_' + side;
	el = document.getElementById(elId);
	
	el.style['opacity'] = 0;
	el.style['background-image'] = 'url(\'' + fileName + '\')';
	el.style['opacity'] = 1;
}

/*
window.onload = function(e) {
	compareSwitch('left', 0);
	compareSwitch('right', 0);
}
*/