const mongoose = require('mongoose');

const EduResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  tags: [{ type: String }],
  youtube: { type: String },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  category: { type: String, enum: ['conceptual','notes','qa','video'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('EduResource', EduResourceSchema);
