//Load the Mongoose module and the Schema object
var mongoose = require('mongoose');
//crypto = require('crypto');

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: 'Email address ir required',
		match: [/.+\@.+\..+/, "Please enter a valid email address"]
	},
	userName: {
		type: String,
		unique: true,
		required: 'UserName is required',
		trim: true
	},
	password: {
		type: String,
		required: true,
		validate: [
			function (password) {
				return password && password.length > 6;
			}, 'Password must be longer than 6 characters'
		]
	},
	created: {
		type: Date,
		default: Date.now
	}
	/*
	,
	salt: {//Used to hash function
		type: String
	}
	*/
});

/*
//Pre-save method to hash the user's password
UserSchema.pre('save', function (next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');//Random generator password
		this.password = this.hashPassword(this.password);
	}
	next();
});

//Method to hash the user's password
UserSchema.methods.hashPassword = function (password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
}

//Method to authenticate an user
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
}
*/
mongoose.model('User', UserSchema);