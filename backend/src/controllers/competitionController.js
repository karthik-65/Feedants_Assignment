const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const User = require('../models/User');

/**
 * Get Competition details by ID (or default current featured competition)
 * Computes live lifecycle status and user registration/submission state.
 */
exports.getCompetitionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    let competition;
    if (id && id !== 'featured' && id !== 'latest') {
      competition = await Competition.findById(id);
    } else {
      competition = await Competition.findOne().sort({ createdAt: -1 });
    }

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    const spotsLeft = Math.max(0, competition.totalSpots - competition.bookedSpots);
    const isFull = spotsLeft === 0;

    // Check user registration and submission state if userId is provided
    let isRegistered = false;
    let userRegistration = null;
    let hasSubmitted = false;
    let userSubmission = null;

    if (userId) {
      userRegistration = await Registration.findOne({
        competitionId: competition._id,
        userId: userId
      });
      isRegistered = !!userRegistration;

      if (isRegistered) {
        userSubmission = await Submission.findOne({
          competitionId: competition._id,
          userId: userId
        });
        hasSubmitted = !!userSubmission;
      }
    }

    // Dynamic state computation based on timestamps & capacity
    const now = new Date();

    // If registration is active but deadline is past (from an older seed), sync with real time
    if (competition.status === 'REGISTRATION_OPEN' && (!competition.registrationDeadline || competition.registrationDeadline <= now)) {
      const remainingMs = (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000;
      competition.registrationDeadline = new Date(now.getTime() + remainingMs);
      competition.submissionStartDate = new Date(now.getTime() + remainingMs + 1 * 86400 * 1000);
      competition.submissionEndDate = new Date(now.getTime() + remainingMs + 18 * 86400 * 1000);
      competition.resultDate = new Date(now.getTime() + remainingMs + 20 * 86400 * 1000);
      await competition.save();
    }

    let computedStatus = competition.status;
    let targetCountdownDate = competition.registrationDeadline;
    let countdownLabel = 'Registration closes in';

    if (now > competition.resultDate || competition.status === 'COMPLETED') {
      computedStatus = 'COMPLETED';
      countdownLabel = 'Competition Ended';
      targetCountdownDate = null;
    } else if (now > competition.submissionEndDate || competition.status === 'UNDER_REVIEW') {
      computedStatus = 'UNDER_REVIEW';
      countdownLabel = 'Results announcement in';
      targetCountdownDate = competition.resultDate;
    } else if (competition.status === 'SUBMISSION_OPEN' || (now > competition.submissionStartDate && now > competition.registrationDeadline)) {
      computedStatus = 'SUBMISSION_OPEN';
      countdownLabel = 'Submission closes in';
      targetCountdownDate = competition.submissionEndDate;
    } else if (isFull) {
      computedStatus = 'HOUSEFULL';
      countdownLabel = 'Submission starts in';
      targetCountdownDate = competition.submissionStartDate;
    } else if (now <= competition.registrationDeadline) {
      computedStatus = 'REGISTRATION_OPEN';
      countdownLabel = 'Registration closes in';
      targetCountdownDate = competition.registrationDeadline;
    } else {
      computedStatus = 'REGISTRATION_CLOSED';
      countdownLabel = 'Submission starts in';
      targetCountdownDate = competition.submissionStartDate;
    }

    // Time remaining in milliseconds
    const timeLeftMs = targetCountdownDate
      ? Math.max(0, new Date(targetCountdownDate).getTime() - now.getTime())
      : 0;

    res.json({
      success: true,
      data: {
        ...competition.toObject(),
        spotsLeft,
        isFull,
        computedStatus,
        countdownLabel,
        targetCountdownDate,
        timeLeftMs,
        userState: {
          isRegistered,
          registration: userRegistration,
          hasSubmitted,
          submission: userSubmission
        }
      }
    });
  } catch (error) {
    console.error('Error in getCompetitionDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch competition details',
      error: error.message
    });
  }
};

/**
 * Concurrency-safe Registration
 * Uses atomic MongoDB operations ($inc with $expr condition) to eliminate race conditions.
 */
exports.registerForCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, paymentMethod = 'Razorpay' } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required for registration'
      });
    }

    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      competitionId: id,
      userId: userId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this competition',
        registration: existingRegistration
      });
    }

    // Check registration timeline
    const now = new Date();
    if (now > competition.registrationDeadline && competition.status !== 'REGISTRATION_OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Registration period has ended'
      });
    }

    // ATOMIC RESERVATION:
    // Only increment bookedSpots if bookedSpots < totalSpots
    const updatedCompetition = await Competition.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
      },
      {
        $inc: { bookedSpots: 1 }
      },
      {
        new: true
      }
    );

    // If null, it means no spots were available at the exact atomic moment
    if (!updatedCompetition) {
      return res.status(409).json({
        success: false,
        message: 'Sorry! The competition just became fully booked. No spots remaining.'
      });
    }

    // Create the registration record
    let registration;
    try {
      registration = await Registration.create({
        competitionId: id,
        userId: userId,
        amountPaid: competition.entryFee,
        paymentStatus: 'PAID',
        paymentReference: `RZP_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      });
    } catch (regError) {
      // If creating registration fails (e.g. unique constraint race), roll back the atomic spot reservation
      await Competition.findByIdAndUpdate(id, {
        $inc: { bookedSpots: -1 }
      });
      throw regError;
    }

    const spotsLeft = Math.max(0, updatedCompetition.totalSpots - updatedCompetition.bookedSpots);

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        registration,
        bookedSpots: updatedCompetition.bookedSpots,
        spotsLeft,
        isFull: spotsLeft === 0
      }
    });
  } catch (error) {
    console.error('Error in registerForCompetition:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

/**
 * Submit user entry
 */
exports.submitEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, title, mediaUrl, mediaType = 'video', description } = req.body;

    if (!userId || !title || !mediaUrl) {
      return res.status(400).json({
        success: false,
        message: 'userId, title, and mediaUrl are required'
      });
    }

    // Verify user is registered
    const registration = await Registration.findOne({
      competitionId: id,
      userId: userId
    });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message: 'You must be registered for this competition to submit an entry'
      });
    }

    // Create or update submission
    const submission = await Submission.findOneAndUpdate(
      { competitionId: id, userId: userId },
      {
        title,
        mediaUrl,
        mediaType,
        description,
        submittedAt: new Date(),
        status: 'SUBMITTED'
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Submission uploaded successfully!',
      data: submission
    });
  } catch (error) {
    console.error('Error in submitEntry:', error);
    res.status(500).json({
      success: false,
      message: 'Submission failed',
      error: error.message
    });
  }
};

/**
 * Admin / Demo State Switcher
 * Allows reviewer to simulate various competition lifecycles on the fly.
 */
exports.switchLifecycleState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body; // 'OPEN', 'ALMOST_FULL', 'HOUSEFULL', 'SUBMISSION_OPEN', 'UNDER_REVIEW', 'COMPLETED'

    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    switch (state) {
      case 'OPEN':
        competition.status = 'REGISTRATION_OPEN';
        competition.bookedSpots = 1;
        competition.registrationDeadline = new Date(now + 1.27 * dayMs); // ~1 day 6 hours left like in image
        competition.submissionStartDate = new Date(now + 2 * dayMs);
        competition.submissionEndDate = new Date(now + 20 * dayMs);
        competition.resultDate = new Date(now + 22 * dayMs);
        break;

      case 'ALMOST_FULL':
        competition.status = 'REGISTRATION_OPEN';
        competition.bookedSpots = competition.totalSpots - 1; // 19/20 booked, only 1 spot left!
        competition.registrationDeadline = new Date(now + 3 * 3600 * 1000); // 3 hours left
        competition.submissionStartDate = new Date(now + 2 * dayMs);
        competition.submissionEndDate = new Date(now + 20 * dayMs);
        competition.resultDate = new Date(now + 22 * dayMs);
        break;

      case 'HOUSEFULL':
        competition.status = 'REGISTRATION_OPEN';
        competition.bookedSpots = competition.totalSpots; // 20/20 booked (0 left)
        competition.registrationDeadline = new Date(now + 1 * dayMs);
        competition.submissionStartDate = new Date(now + 2 * dayMs);
        competition.submissionEndDate = new Date(now + 20 * dayMs);
        competition.resultDate = new Date(now + 22 * dayMs);
        break;

      case 'SUBMISSION_OPEN':
        competition.status = 'SUBMISSION_OPEN';
        competition.registrationDeadline = new Date(now - 1 * dayMs);
        competition.submissionStartDate = new Date(now - 2 * 3600 * 1000);
        competition.submissionEndDate = new Date(now + 15 * dayMs);
        competition.resultDate = new Date(now + 17 * dayMs);
        break;

      case 'UNDER_REVIEW':
        competition.status = 'UNDER_REVIEW';
        competition.registrationDeadline = new Date(now - 10 * dayMs);
        competition.submissionStartDate = new Date(now - 8 * dayMs);
        competition.submissionEndDate = new Date(now - 1 * 3600 * 1000);
        competition.resultDate = new Date(now + 2 * dayMs);
        break;

      case 'COMPLETED':
        competition.status = 'COMPLETED';
        competition.registrationDeadline = new Date(now - 15 * dayMs);
        competition.submissionStartDate = new Date(now - 13 * dayMs);
        competition.submissionEndDate = new Date(now - 5 * dayMs);
        competition.resultDate = new Date(now - 1 * dayMs);
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid state specified' });
    }

    await competition.save();

    res.json({
      success: true,
      message: `Competition lifecycle switched to ${state}`,
      data: competition
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Reset competition to initial assignment demo state
 */
exports.resetCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const competition = await Competition.findById(id);
    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    // Remove all registrations except the first 1 demo participant
    const registrations = await Registration.find({ competitionId: id }).sort({ createdAt: 1 });
    if (registrations.length > 1) {
      const idsToRemove = registrations.slice(1).map(r => r._id);
      await Registration.deleteMany({ _id: { $in: idsToRemove } });
    }

    competition.bookedSpots = 1;
    competition.status = 'REGISTRATION_OPEN';
    const now = Date.now();
    // 1 day, 6 hours, 28 minutes, 32 seconds
    const exactRemainingMs = (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000;
    competition.registrationDeadline = new Date(now + exactRemainingMs);
    competition.submissionStartDate = new Date(now + exactRemainingMs + 4 * 3600 * 1000);
    competition.submissionEndDate = new Date(now + 19 * 86400 * 1000);
    competition.resultDate = new Date(now + 21 * 86400 * 1000);

    await competition.save();

    res.json({
      success: true,
      message: 'Competition reset to original reference state (1/20 booked, 19 spots left)',
      data: competition
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get all available demo users
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
