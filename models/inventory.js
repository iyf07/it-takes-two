const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    name: String,
    game: String,
    date: Date,
    receivedate: Date,
    priority: Number,
    main: Boolean,
    secondary: Boolean,
})

module.exports = mongoose.model('Inventory', InventorySchema);