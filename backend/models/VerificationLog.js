const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema({
  verificationCode: { type: String, required: true },
  ipAddress: String,
  userAgent: String,
  verifiedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], default: 'success' }
});

module.exports = mongoose.model('VerificationLog', VerificationLogSchema);