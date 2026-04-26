const Student = require('../models/Student');
const Document = require('../models/Document');
const VerificationLog = require('../models/VerificationLog');

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const validDocuments = await Document.countDocuments({ status: 'issued' });
    const revokedDocuments = await Document.countDocuments({ status: 'revoked' });
    const recentVerifications = await VerificationLog.find().sort({ verifiedAt: -1 }).limit(10);
    
    res.json({
      totalStudents,
      totalDocuments,
      validDocuments,
      revokedDocuments,
      recentVerifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this new function for recent documents
exports.getRecentDocuments = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentDocs = await Document.find()
      .sort({ issueDate: -1 })
      .limit(limit)
      .populate('studentId', 'fullName admissionNo className');
    
    res.json(recentDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};