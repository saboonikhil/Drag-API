const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    type: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

NotificationSchema.virtual('url').get(function () {
    return '/notification/' + this._id;
})

NotificationSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
    Notification: Notification
}