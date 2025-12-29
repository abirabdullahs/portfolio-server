const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // store as HTML from editor
  youtube: { type: String },
  tags: [{ type: String }],
  type: { type: String, enum: ['code', 'tools', 'edu'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
