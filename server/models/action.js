var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
//set up a mongoose model
var ActionSchema = new Schema({
	enabled: {
		type: Boolean,
		required: true
	}, 
	id: {
		unique: true,
		type: String,
		required: true
	},
	type: {
		type: String,
		required: false
	},
	title: {
		type: String,
		required: true,
	},
	start: {
		type: Date,
		required: true
	},
	end: {
		type: Date,
		required: true
	},
	allDay: {
		type: Boolean,
		required: true
	},   
	email: {
		type: String,
		required: true
	},
	color: {
	   type: String
	},
	fields: {
		type: Array
	},
	filepath: {
		type: String
	},
	createdBy: {
		type: String,
		required: true
	}
});


module.exports = mongoose.model('Action', ActionSchema);