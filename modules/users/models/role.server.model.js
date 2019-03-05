/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  title: String,
  description: String,
  iams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IAM',
    required: true,
  }],
  protected: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'roles',
});

module.exports = mongoose.model('Role', RoleSchema);
