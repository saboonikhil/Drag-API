const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    driverID: { type: String, require: true, unique: true },
    driverName: { type: String, require: true, max: 100, min: 3 },
    driverContact: { type: String, require: true, unique: true },
    orgName: { type: String, default: 'Not Available' },
    orgContact: { type: String, default: 'Not Available' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

DriverSchema.virtual('url').get(function () {
    return '/driver/' + this._id;
})

DriverSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Driver = mongoose.model('Driver', DriverSchema);

module.exports = {
    Driver: Driver
}