const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PiggyBankSchema = new Schema({
    name: String, points: Number, currency: String, date: Date, description: String, status: String, type: String, priority: Number,
})

module.exports = mongoose.model('PiggyBank', PiggyBankSchema);