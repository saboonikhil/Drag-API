const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'User', default: null },
	message: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

FeedbackSchema.virtual('url').get(function () {
	return '/feedback/' + this._id;
})

FeedbackSchema.method('update', function (updates, callback) {
	Object.assign(this, updates, { updatedAt: new Date() });
	this.save(callback);
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = {
	Feedback: Feedback
}