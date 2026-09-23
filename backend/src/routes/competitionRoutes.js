const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

// Get featured or specific competition
router.get('/featured', competitionController.getCompetitionDetails);
router.get('/:id', competitionController.getCompetitionDetails);

// Register user for competition (Atomic, Concurrency-Safe)
router.post('/:id/register', competitionController.registerForCompetition);

// Submit entry
router.post('/:id/submit', competitionController.submitEntry);

// Demo & testing helpers
router.post('/:id/switch-state', competitionController.switchLifecycleState);
router.post('/:id/reset', competitionController.resetCompetition);

module.exports = router;
