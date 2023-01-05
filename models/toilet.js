const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ToiletSchema = new Schema({
    name: String, date: Date, description: String, status: String,
})

module.exports = mongoose.model('Toilet', ToiletSchema);