const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CurrencySchema = new Schema({
    potatoes: Number, watermelons: Number, eggs: Number, poops: Number, toilet_papers: Number, chestnuts: Number,
})

module.exports = mongoose.model('Currency', CurrencySchema);