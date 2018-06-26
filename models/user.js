const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: {type: String, required: true, max: 100, min: 3},
	email: {type: String, required: true, unique: true},
	contact: {type: String, required: true, unique: true},
	alternateContact: {type: String, default: 'Not Available'},
	tripsCompleted: {type: Number, default: 0},
	password: {type: String, required: true},
	createdAt: {type: Date, default: Date.now },
	updatedAt: {type: Date, default: Date.now },
	carBooked: {type: Schema.ObjectId, ref: 'Cab', default: null}
});

UserSchema.virtual('url').get(function(){
	return '/user/' + this._id;
})

UserSchema.method('update', function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date() });
	this.save(callback);
});

const User = mongoose.model('User', UserSchema);

module.exports = {
	User: User	
}