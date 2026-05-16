const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  admissionNo: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: Date,
  className: String,      // e.g., "10th Grade" – used as department
  parentContact: String,
  photo: { type: String, default: '' },   // Base64 image string (max ~15KB after encoding)
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);