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

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
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
  let testId;

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test Book'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.lengthOf(res.body.comments, 0, "Should have length of zero. It's a new array")
            assert.property(res.body, '_id', 'should have a property _id');
            assert.property(res.body, 'comments', 'should have a property comments');
            assert.equal(res.body.title, 'Test Book');
            testId = res.body._id
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Please submit a valid title.')
            done();  
          })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
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
          .get('api/books/wrongdata')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid ID. Please try again.')
            done();
        })
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.property(res.body, 'title', 'should have property = title');
            assert.property(res.body, 'comments', 'should have property = comments')
            done();
        })
        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({comment: 'test comment'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            assert.property(res.body, 'title', 'should have property = title');
            assert.property(res.body, 'comments', 'should have property = comments')
            assert.isArray(res.body.comments, 'comments should be an array')
            done();
          })
        
      });
      
    });

  });

});
