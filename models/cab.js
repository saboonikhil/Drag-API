const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CabSchema = new Schema({
	isShared: {type: Boolean, default: false},
	isBooked: {type: Boolean, default: false},
	carName: {type: String, require: true},
	pickup: {type: String, default: 'Not Available'},
	drop: {type: String, default: 'Not Available'},
	startDate: {type: String, default: 'Not Available'},
	startTime: {type: String, default: 'Not Available'},
	seats: {type: Number, require: true},
	driverName: {type: String, default: 'Not Available'},
	driverContact: {type: String, default: 'Not Available'},
	driverID: {type: String, default: 'Not Available'},
	carNumber: {type: String, default: 'Not Available'},
	collegeName: {type: String, default: 'Not Available'},
	fare: {type: Number, require: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

CabSchema.virtual('url').get(function(){
	return '/cab/' + this._id;
})

CabSchema.method('update', function(updates, callback){
	Object.assign(this, updates, {updatedAt: new Date() });
	this.save(callback);
});

const Cab = mongoose.model('Cab', CabSchema);

module.exports = {
	Cab: Cab
}