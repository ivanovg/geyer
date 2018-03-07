var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
 
//set up a mongoose model
var ExtraSchema = new Schema({
  email: {
        type: String,
        unique: true,
        required: true
    },
  table: {
	  	type: Array,
	  	required: true
    }
    
});
 
module.exports = mongoose.model('Extra', ExtraSchema);