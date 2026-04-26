const express = require('express');
const { 
  generateDocument, 
  verifyDocument, 
  getDocumentHistory,
  getAllDocuments,
  getRecentDocuments,
  revokeDocument          // <-- added
} = require('../controllers/documentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.post('/verify', verifyDocument); // public endpoint for verification page

// Protected routes (require authentication)
router.use(auth); // all routes below this line require authentication

// Generate a new document (admin/verifier only)
router.post('/generate', roleCheck('admin', 'verifier'), generateDocument);

// Get all documents (for history page)
router.get('/', getAllDocuments);

// Get recent documents with limit (for dashboard)
router.get('/recent', getRecentDocuments);

// Get document history for a specific student
router.get('/history/:studentId', getDocumentHistory);

// Revoke a document (admin/verifier only)
router.put('/:id/revoke', roleCheck('admin', 'verifier'), revokeDocument);

module.exports = router;