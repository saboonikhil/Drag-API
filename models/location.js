const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    city: {type: String, required: true, unique: true },
    setA: [{ type: String, default: null}],
    setB: [{ type: String, default: null}]
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