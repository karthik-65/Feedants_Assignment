const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['video', 'audio', 'image'],
    default: 'video'
  },
  description: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'],
    default: 'SUBMITTED'
  }
}, {
  timestamps: true
});

SubmissionSchema.index({ competitionId: 1, userId: 1 });

module.exports = mongoose.model('Submission', SubmissionSchema);
