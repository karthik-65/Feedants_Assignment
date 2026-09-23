const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
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
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'],
    default: 'PAID'
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentReference: {
    type: String,
    default: () => 'PAY_' + Math.random().toString(36).substring(2, 10).toUpperCase()
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only register once per competition
RegistrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
