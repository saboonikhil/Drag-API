const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    orderId: { type: String, required: true },
    cab: { type: Schema.ObjectId, ref: 'Cab', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TransactionSchema.virtual('url').get(function () {
    return '/Transaction/' + this._id;
})

TransactionSchema.method('update', function (updates, callback) {
    Object.assign(this, updates, { updatedAt: new Date() });
    this.save(callback);
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {
    Transaction: Transaction
}