var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    userName:{
		 type: String,
		 unique: true,
		 required: true
	 },
    email:{
		 type: String,
		 unique: true,
		 required: true
	 },
    password:{
		 type: String,
		 unique: true,
		 required: true
	 }
});

module.exports = mongoose.model('User',UserSchema);