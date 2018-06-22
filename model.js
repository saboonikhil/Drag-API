const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: {type: String, require: true},
	email: {type: String, require: true, unique: true},
	contact: {type: String, require: true, unique: true},
	alternateContact: {type: String, default: 'Not Available'},
	tripsCompleted: {type: Number, default: 0},
	password: {type: String, require: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

UserSchema.method('update', function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date() });
	this.save(callback);
});

const CarDetailsSchema = new Schema({
	isShared: {type: Boolean, default: false},
	isBooked: {type: Boolean, default: false},
	carName: {type: String, require: true},
	pickupLocation: {type: String, default: 'Not Available'},
	dropLocation: {type: String, default: 'Not Available'},
	startDate: {type: String, default: 'Not Available'},
	startTime: {type: String, default: 'Not Available'},
	seats: {type: Number, require: true},
	driverName: {type: String, default: 'Not Available'},
	driverContact: {type: String, default: 'Not Available'},
	driverID: {type: String, default: 'Not Available'},
	carNumber: {type: String, default: 'Not Available'},
	orgName: {type: String, default: 'Not Available'},
	collegeName: {type: String, default: 'Not Available'},
	fare: {type: Number, require: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

CarDetailsSchema.method('update', function(update, callback){
	Object.assign(this, updates, {updatedAt: new Date() });
});

const User = mongoose.model('User', UserSchema);
const CarDetail = mongoose.model('CarDetail', CarDetailsSchema);

module.exports = {
	User: User,
	CarDetail: CarDetail
}