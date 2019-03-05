/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const IAMSchema = new Schema({
  iam: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  title: String,
  description: String,
  resource: String,
  permission: String,
  module: String,
  affectable: {
    type: Boolean,
    default: true,
    required: true,
  },
  system: {
    type: Boolean,
    default: false,
    required: true,
  },
}, {
  collection: 'iams',
});

module.exports = mongoose.model('IAM', IAMSchema);
