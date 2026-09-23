const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  rank: { type: Number, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  icon: { type: String, default: 'trophy' }
}, { _id: false });

const PreviousWinnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  score: { type: Number }
}, { _id: false });

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Feedants Classical Dance'
  },
  category: {
    type: String,
    default: 'Dance'
  },
  tags: [{
    type: String
  }],
  prizePool: {
    type: Number,
    required: true,
    min: 0,
    default: 1500
  },
  entryFee: {
    type: Number,
    required: true,
    min: 0,
    default: 99
  },
  currency: {
    type: String,
    default: '₹'
  },
  totalSpots: {
    type: Number,
    required: true,
    min: 1,
    default: 20
  },
  bookedSpots: {
    type: Number,
    default: 0,
    min: 0
  },
  // Lifecycle manual override or dynamic status
  status: {
    type: String,
    enum: ['UPCOMING', 'REGISTRATION_OPEN', 'SUBMISSION_OPEN', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED'],
    default: 'REGISTRATION_OPEN'
  },
  // Timeline dates
  registrationDeadline: {
    type: Date,
    required: true
  },
  submissionStartDate: {
    type: Date,
    required: true
  },
  submissionEndDate: {
    type: Date,
    required: true
  },
  resultDate: {
    type: Date,
    required: true
  },
  judge: {
    name: { type: String, default: 'Manju Dubey' },
    role: { type: String, default: 'Professional Kathak Dancer' },
    experience: { type: String, default: '12+ Years of Experience' },
    avatarUrl: { type: String },
    introVideoUrl: { type: String }
  },
  previousWinners: [PreviousWinnerSchema],
  tabContent: {
    about: {
      en: { type: String },
      hi: { type: String }
    },
    judgingParameters: {
      en: { type: String },
      hi: { type: String }
    },
    rulesAndEligibility: {
      en: { type: String },
      hi: { type: String }
    }
  },
  rewards: [RewardSchema],
  disclaimer: {
    type: String,
    default: 'Only contributions from paid participants will be considered for judging.'
  },
  referralInfo: {
    code: { type: String, default: 'referral23' },
    link: { type: String, default: 'https://feedants.com/referral23' },
    discountText: { type: String, default: 'Win extra 100 for every express' }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for remaining spots
CompetitionSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

// Helper to compute dynamic lifecycle state if dates have passed
CompetitionSchema.methods.getComputedStatus = function () {
  // If status is forced for demo purposes, respect it
  if (this._overrideStatus) {
    return this._overrideStatus;
  }
  
  const now = new Date();
  if (now > this.resultDate) {
    return 'COMPLETED';
  }
  if (now > this.submissionEndDate) {
    return 'UNDER_REVIEW';
  }
  if (now > this.submissionStartDate) {
    return 'SUBMISSION_OPEN';
  }
  if (now > this.registrationDeadline || this.bookedSpots >= this.totalSpots) {
    return 'REGISTRATION_CLOSED';
  }
  return 'REGISTRATION_OPEN';
};

module.exports = mongoose.model('Competition', CompetitionSchema);
