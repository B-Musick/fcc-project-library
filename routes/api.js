/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

let Book = require('../models/Book');
let Comment = require('../models/Comment');


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).populate('comments').exec((err,books)=>{
        err ? res.send(err):res.json(books)
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title){
        Book.create({ title }, (err, newBook) => {
          err ? console.log(err) : res.json(newBook)
        })
      }else{
        res.json('no title given')
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({},(err,outcome)=>{
        err ? res.json(err): res.json(outcome)
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid).populate('comments').exec((err,book)=>{
        err ? res.json('no book exists'): res.json(book)
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      console.log(comment)
      Book.findById(bookid, (err, book) => {
        if (err) { console.log(err); res.redirect('/'); }
        else {
          // Find the project which issue is being submitted
          Comment.create({body:comment}, (err, newComment) => {
            // Create the comment and push to the book
            if (err) res.json('Couldnt create comment')
            else {
              // Push the comment to the associated book
              book.comments.push(newComment)
              book.commentcount++;
              book.save()
              res.json(book)
            }
          })
        }
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid,(err,outcome)=>{
        err ? res.json(err): res.json(outcome)
      })
    });
  
};
