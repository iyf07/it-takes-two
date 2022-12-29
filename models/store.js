const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StoreSchema = new Schema({
    name: String, points: Number, currency: String, description: String, priority: Number,
})

module.exports = mongoose.model('Store', StoreSchema);