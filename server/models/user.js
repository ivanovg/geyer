var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
 
//set up a mongoose model
var UserSchema = new Schema({
  email: {
        type: String,
        unique: true,
        required: true
    },
  pw: {
        type: String,
        required: true
    },
  firstname: {
        type: String
    },
  lastname: {
        type: String
   },
   company: {
       type: String
   },
   street: {
       type: String
   },
   zip: {
       type: String
   },
   place: {
       type: String
   },
   role: {
        type: String,
        required: true
   },
   status: {
	   type: String,
       required: true
   },
   tel: {
	   type: String
   },
   fax: {
	   type: String 
   },
   opening: {
	   type: String 
   },
   taxnumber: {
	   type: String 
   },
   iban: {
	   type: String 
   },
   bic: {
	   type: String 
   },
   cp1_firstname: {
	   
   },
   cp1_lastname: {
	   
   },
   cp1_tel: {
	   
   },
   cp1_email: {
	   
   },
   cp2_firstname: {
	   
   },
   cp2_lastname: {
	   
   },
   cp2_tel: {
	   
   },
   cp2_email: {
	   
   },
    
});
 
UserSchema.pre('save', function (next) {
	
    var user = this;
    if (this.isModified('pw') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            
            bcrypt.hash(user.pw, salt, null, function (err, hash) {
            	
                if (err) {
                    return next(err);
                }
                user.pw = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
	
	console.log("passw: " + passw);
	console.log("this.pw: " + this.pw);
	
    bcrypt.compare(passw, this.pw, function (err, isMatch) {
        if (err) {
        	console.log("err" + err);
            return cb(err);
        }
        console.log("isMatch: " + isMatch);
        cb(null, isMatch);
    });
};
 
module.exports = mongoose.model('User', UserSchema);