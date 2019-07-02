const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CabSchema = new Schema({
	isAvailable: { type: Boolean, default: true },
	tripId: { type: String, default: null },
	city: { type: String, default: null },
	pickup: { type: String, default: null },
	drop: { type: String, default: null },
	startTime: { type: Date, default: null },
	endTime: { type: Date, default: null },
	seats: { type: String, required: true },
	fare: { type: String, default: null },
	carName: { type: String, default: null },
	carNumber: { type: String, default: null },
	riders: [{ type: Schema.ObjectId, ref: 'User', default: null }],
	driverName: { type: String, default: null },
	driverContact: { type: String, default: null },
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