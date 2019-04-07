const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    collegeName: {type: String, required: true, unique: true },
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now },
    setA: [{ type: String, unique: true, default: null}],
    setB: [{ type: String, unique: true, default: null}]
});

LocationSchema.virtual('url').get(function () {
    return '/location/' + this._id;
})

LocationSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = {
    Location: Location
}