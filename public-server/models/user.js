var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    userName: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User',UserSchema);