const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CabSchema = new Schema({
	isShared: { type: Boolean, default: false },
	isBooked: { type: Boolean, default: false },
	collegeName: { type: String, required: true },
	pickup: { type: String, default: null },
	drop: { type: String, default: null },
	startTime: { type: Date, default: null },
	endTime: { type: Date, default: null },
	seats: { type: String, required: true },
	fare: { type: String, required: true },
	riders: [{ name: { type: String }, contact: { type: String } }],
	driverName: { type: String, default: null },
	driverContact: { type: String, default: null },
	carName: { type: String, required: true },
	carNumber: { type: String, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

CabSchema.virtual('url').get(function () {
	return '/cab/' + this._id;
})

CabSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updatedAt: new Date() });
	this.save(callback);
});

const Cab = mongoose.model('Cab', CabSchema);

module.exports = {
	Cab: Cab
}