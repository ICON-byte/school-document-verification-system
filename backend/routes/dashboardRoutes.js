const express = require('express');
const { getStats, getRecentDocuments } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, getStats);
router.get('/recent', auth, getRecentDocuments);  // Add this line

module.exports = router;