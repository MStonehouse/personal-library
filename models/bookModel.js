const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
const BookSchema = new Schema({
  title: {type: String, required: true, trim: true},
  comments: [{body: String}],
},{
  timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'}
});
*/


const BookSchema = new Schema({
  title: {type: String, required: true, trim: true},
  commentcount: {type: Number, default: 0},
  comments: [String],
},{
  timestamps: {createdAt: 'created_on', updatedAt: 'updated_on'}
});

module.exports = mongoose.model('BookSchema', BookSchema);