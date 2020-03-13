/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let Book = require('../models/Book');
let Comment = require('../models/Comment');


chai.use(chaiHttp);
Book.collection.drop();
// Create the new project
before(function (done) {
  var newBook = new Book({
    title: 'test',
  });

  newBook.save(function (err) {
    done();
  });
});

let testId;
suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
 
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        testId = res.body[0]._id;
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title:'testBook'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title,'testBook')
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: ''
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no title given');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/lk33j2l3k3j3l')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body.name)
            assert.notProperty(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.notProperty(res.body, 'title', 'Books in array should contain title');
            assert.notProperty(res.body, '_id', 'Books in array should contain _id');
            assert.notEqual(res.body._id, testId)
            assert.equal(res.body,'no book exists') // May have to remove this
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'comments', 'Comments should be in array');
            assert.isArray(res.body.comments)
            assert.equal(res.body._id,testId)
            done();
          });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+testId)
          .send({
            comment: 'This is a test comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body.comments)
            // assert.equal(res.body.comments[0], 'This is a test comment')
            Comment.findById(res.body.comments[0],(err,comment)=>{
              
              assert.equal(comment, 'This is a test comment')
            })
            done();

          });
      });
      
    });

  });

});
