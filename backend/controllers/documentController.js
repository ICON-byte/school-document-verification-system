const Document = require('../models/Document');
const Student = require('../models/Student');
const VerificationLog = require('../models/VerificationLog');
const crypto = require('crypto');

// Helper: generate unique verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(16).toString('hex');
};

// @route POST /api/documents/generate
exports.generateDocument = async (req, res) => {
  try {
    const { studentId, documentType, content } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const verificationCode = generateVerificationCode();
    const doc = await Document.create({
      studentId,
      documentType,
      content,
      verificationCode,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Document generated',
      document: doc,
      verificationLink: `http://localhost:5173/verify/${verificationCode}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/documents/verify
exports.verifyDocument = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const doc = await Document.findOne({ verificationCode }).populate('studentId');
    if (!doc || doc.status !== 'issued') {
      await VerificationLog.create({ verificationCode, status: 'failed', ipAddress: req.ip });
      return res.status(404).json({ valid: false, message: 'Invalid or revoked document' });
    }

    await VerificationLog.create({ verificationCode, status: 'success', ipAddress: req.ip });

    res.json({
      valid: true,
      document: {
        type: doc.documentType,
        issueDate: doc.issueDate,
        student: {
          name: doc.studentId.fullName,
          admissionNo: doc.studentId.admissionNo,
          className: doc.studentId.className
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/documents/:id/revoke
exports.revokeDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (doc.status === 'revoked') {
      return res.status(400).json({ message: 'Document already revoked' });
    }
    doc.status = 'revoked';
    await doc.save();
    res.json({ message: 'Document revoked successfully', document: doc });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/documents/history/:studentId
exports.getDocumentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const docs = await Document.find({ studentId }).sort({ issueDate: -1 }).populate('studentId', 'fullName admissionNo className');
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/documents?page=1&limit=10
exports.getAllDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      Document.find()
        .sort({ issueDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('studentId', 'fullName admissionNo className'),
      Document.countDocuments()
    ]);

    res.json({
      documents,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/documents/recent
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