/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose    = require('mongoose');
var BookSchema = require('../models/bookModel.js');

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(Error, err.message);
  });

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){

      BookSchema.find({})
        .select('-comments')
        .select('-created_on')
        .select('-updated_on')
        .select('-__v')
        .exec(function(err, data) {
          if (err) { return next(err) };       
          res.json(data);
        })
    })
    
    .post(function (req, res, next){
      //response will contain new book object including _id, title, comments
      //response will be in json format
      let title = req.body.title;
    
      let newBook = new BookSchema({
        title: title
      });
    
      if (title === '') {
        res.json({error: 'Please submit a valid title.'})    
      } else {
        newBook.save(function(err, saveData) {
          if (err) { return next(err) };

          let returnObj = {
            title: saveData.title,
            comments: saveData.comments,
            _id: saveData._id
          };

          res.json(returnObj);
        })
      }
 
    })
    
    .delete(function(req, res, next){
      //if successful response will be 'complete delete successful'
    
      BookSchema.remove({}, function(err, data) {
        if (err) { return next(err) };
        res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res, next){
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let bookId = req.params.id;
      BookSchema.findById(bookId)
        .select('-commentcount')
        .select('-created_on')
        .select('-updated_on')
        .select('-__v')
        .exec(function(err, data) {
          if (err) { 
            res.json({error: 'Invalid ID. Please try again.'})
          };
          res.json(data);
      })
      
    })
    
    .post(function(req, res, next){
      //json res format same as .get
      let bookId = req.params.id;
      let comment = req.body.comment;

      BookSchema.findById(bookId, function(err, findData) {
        if (err) { return next(err) };
        findData.comments.push(comment);
        findData.commentcount += 1;
        
        findData.save(function(err, saveData) {
          if (err) { return next(err) };
          
          let returnObj = {
            _id: saveData._id,
            title: saveData.title,
            comments: saveData.comments
          };
    
          res.json(returnObj);
        })
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'delete successful'
      let bookId = req.params.id;
    
      BookSchema.findByIdAndRemove(bookId, function(err, data, next) {
        if (err) { return next(err) };
        res.send('delete successful');
      })
    });
  
};
