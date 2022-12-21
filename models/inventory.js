const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InventorySchema = new Schema({
    name: String, game: String, date: Date, main: Boolean, secondary: Boolean, priority: Number,
})

module.exports = mongoose.model('Inventory', InventorySchema);