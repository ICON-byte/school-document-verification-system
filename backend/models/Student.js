const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  admissionNo: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: Date,
  className: String,      // e.g., "10th Grade"
  parentContact: String,
  profilePhoto: String,   // URL or path
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);