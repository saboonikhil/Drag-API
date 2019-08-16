const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CabSchema = new Schema({
	isAvailable: { type: Boolean, default: false },
	isShared: { type: Boolean, default: false },
	type: { type: String, default: null, enum: ['Sedan', 'SUV'] },
	pickup: { type: String, default: null },
	drop: { type: String, default: null },
	startTime: { type: Date, default: null },
	endTime: { type: Date, default: null },
	riders: [{
		_id: { type: Schema.ObjectId, ref: 'User', default: null },
		tripId: { type: String, default: null },
		tripStatus: { type: String, default: null },
		pickup: { type: String, default: null },
		drop: { type: String, default: null },
		seats: { type: String, default: null },
		startTime: { type: String, default: null },
		fare: { type: String, default: null },
		luggageCount: { type: String, default: null },
		rawData: { type: JSON, default: null },
	}],
	partner: { type: Schema.ObjectId, ref: 'Partner', default: null },
	driverName: { type: String, default: null },
	driverContact: { type: String, default: null },
	carName: { type: String, default: null },
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