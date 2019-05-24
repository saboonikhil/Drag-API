const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartnerSchema = new Schema({
    name: { type: String, required: true, max: 100, min: 3 },
    email: { type: String, required: true, unique: true, trim: true },
    contact: { type: String, required: true, unique: true },
    alternateContact: { type: String, default: null },
    password: { type: String, required: true },
    drivers: [{ type: Schema.ObjectId, ref: 'User', default: null }],
    cabs: [{ type: Schema.ObjectId, ref: 'Cab', default: null }],
    salt: String,
    temp_str: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

PartnerSchema.virtual('url').get(function () {
    return '/partner/' + this._id;
})

PartnerSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Partner = mongoose.model('Partner', PartnerSchema);

module.exports = {
    Partner: Partner
}