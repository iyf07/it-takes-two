const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PiggyModelSchema = new Schema({
    name: String,
    points: Number,
    currency: String,
    description: String,
})

module.exports = mongoose.model('PiggyModel', PiggyModelSchema);