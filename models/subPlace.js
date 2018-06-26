const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subPlaceSchema = new Schema({
    location: { type: String, require: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

subPlaceSchema.virtual('url').get(function () {
    return '/subPlace/' + this._id;
})

subPlaceSchema.method('update', function (update, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const SubPlace = mongoose.model('SubPlace', subPlaceSchema);

module.exports = {
    SubPlace: SubPlace
}