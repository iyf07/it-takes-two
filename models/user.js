const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    code: String,
    type: String,
})

module.exports = mongoose.model('User', UserSchema);