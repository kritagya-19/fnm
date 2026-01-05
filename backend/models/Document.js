const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['contract', 'invoice', 'receipt', 'report', 'presentation', 'other'],
    default: 'other'
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Client', 'Project', 'Transaction', ''],
      default: ''
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedTo.model'
    }
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);

