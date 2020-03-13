let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
    body: String
});

module.exports = mongoose.model('Comment',commentSchema);