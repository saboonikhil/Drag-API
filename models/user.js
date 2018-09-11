const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const UserSchema = new Schema({
	username: {type: String, required: true, max: 100, min: 3},
	email: {type: String, required: true, unique: true, trim: true},
	contact: {type: String, required: true, unique: true},
	alternate_contact: {type: String, default: 'Not Available'},
	trips_completed: {type: Number, default: 0},
	password: {type: String, required: true},
	salt: String,
	temp_str: String,
	created_at: {type: Date, default: Date.now },
	updated_at: {type: Date, default: Date.now },
	cabs_booked: [{type: Schema.ObjectId, ref: 'Cab', default: null}]
});

UserSchema.virtual('url').get(function(){
	return '/user/' + this._id;
});

UserSchema.virtual('updated_at_formatted').get(function(){
	return moment(this.updatedAt).format('MMMM Do, YYYY');
});

UserSchema.method('update', function(updates, callback) {
	
	Object.assign(this, updates, {updated_at: new Date()});
	
	this.save(callback);
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User: User	
}