const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  documentType: { type: String, required: true },  // e.g., "Bonafide", "Transfer Certificate"
  issueDate: { type: Date, default: Date.now },
  content: Object,          // store JSON data used to generate PDF
  pdfUrl: String,           // path or cloud URL to stored PDF
  verificationCode: { type: String, unique: true }, // shareable code for verification
  status: { type: String, enum: ['draft', 'issued', 'revoked'], default: 'issued' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Document', DocumentSchema);