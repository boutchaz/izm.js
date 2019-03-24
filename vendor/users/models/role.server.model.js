/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const {
  model,
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

RoleSchema.statics.getIAMs = async function getIAMs(roles = []) {
  const IAM = model('IAM');
  let list = roles
    .filter(r => Boolean(r) && typeof r === 'string');

  list = await this.find({ name: list });
  list = list.filter(Boolean)
    .map(r => r.iams)
    .filter(Boolean)
    .flat();

  list = await IAM.getChildren(list);

  return list;
};

module.exports = mongoose.model('Role', RoleSchema);
