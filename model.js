const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: String,
	email: String,
	contact: String,
	alternateContact: {type: String, default: 'Not Available'},
	tripsCompleted: {type: Number, default: 0},
	password: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

UserSchema.method('update', (updates, callback) => {
	Object.assign(this, updates, { updatedAt: new Date() });
	this.parent().save(callback);
});

const User = mongoose.model('User', UserSchema);

module.exports.User = User;