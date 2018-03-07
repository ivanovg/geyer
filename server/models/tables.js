var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
//set up a mongoose model
var TablesSchema = new Schema({

 uniqueId: {
	 type: String,
	 required: true,
	 unique: true
 },	
  partnerId: {
      type: String,
      required: true
  },	
  tableId: {
        type: String,
        required: true
    },
  table: {
	  	type: Array,
	  	required: true
    }
    
});

module.exports = mongoose.model('Tables', TablesSchema);