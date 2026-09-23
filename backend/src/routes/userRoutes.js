const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const User = require('../models/User');

router.get('/', competitionController.getUsers);

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, avatarUrl } = req.body;
    const user = await User.create({ name, email, phone, avatarUrl });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
