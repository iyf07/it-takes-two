const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const IssueSchema = new Schema({
    name: String, description: String, date: Date, status: String, order: Number, priority: Number,
})

module.exports = mongoose.model('Issue', IssueSchema);