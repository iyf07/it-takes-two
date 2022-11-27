const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    name: String,
    description: String,
    date: Date,
    priority: Number,
    status: String,
    order: Number,
})

module.exports = mongoose.model('Issue', IssueSchema);