const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    collegeName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    pickup: { type: Schema.ObjectId, ref: 'subPlace' },
    drop: { type: Schema.ObjectId, ref: 'subPlace' }
});

PlaceSchema.virtual('url').get(function () {
    return '/place/' + this._id;
})

PlaceSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Place = mongoose.model('Place', PlaceSchema);

module.exports = {
    Place: Place
}