let mongoose = require('mongoose');

let bookSchema = new mongoose.Schema({
    title: {type:String, default:'Unknown'},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    commentcount: {type:Number, default:0}
});

module.exports = mongoose.model('Book',bookSchema);