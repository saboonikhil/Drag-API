const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const UserSchema = new Schema({
	role: { type: String, default: 'user', lowercase: true, enum: ['user', 'driver', 'admin'] },
	name: { type: String, required: true, max: 100, min: 3 },
	email: { type: String, required: true, unique: true, trim: true },
	contact: { type: String, required: true, unique: true },
	alternateContact: { type: String, default: null },
	password: { type: String, required: true },
	trips: [{ type: Schema.ObjectId, ref: 'Cab', default: null }],
	salt: String,
	temp_str: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

UserSchema.virtual('url').get(function () {
	return '/user/' + this._id;
});

UserSchema.virtual('updated_at_formatted').get(function () {
	return moment(this.updatedAt).format('MMMM Do, YYYY');
});

UserSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updated_at: new Date() });
	this.save(callback);
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User: User
}