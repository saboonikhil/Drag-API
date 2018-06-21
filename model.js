const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: String,
	email: String,
	contact: String,
	alternateContact: {type: String, default: 'Not Available'},
	tripsCompleted: {type: Number, default: 0},
	password: String
});

const User = mongoose.model('User', UserSchema);

module.exports.User = User;