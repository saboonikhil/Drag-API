const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
    orderId: { type: String, required: true },
    status: { type: String },
    cab: { type: Schema.ObjectId, ref: 'Cab', default: null },
    travelDetails: { pickup: { type: String }, drop: { type: String }, startTime: { type: Date }, seats: { type: String }, fare: { type: String } },
    checksumHash: { type: String, required: true },
    rawData: { type: JSON, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TripSchema.virtual('url').get(function () {
    return '/trip/' + this._id;
})

TripSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = {
    Trip: Trip
}