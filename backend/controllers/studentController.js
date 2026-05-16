const Student = require('../models/Student');

// Helper to validate Base64 image size and format (max 15KB)
const validatePhoto = (photo) => {
  if (!photo || photo === '') return true; // empty is allowed
  
  // Check if it's a valid data URL for an image
  if (!photo.startsWith('data:image/')) {
    return false;
  }
  
  // Approximate size: Base64 length * 0.75 = original bytes
  const approxBytes = photo.length * 0.75;
  const MAX_SIZE_BYTES = 15 * 1024; // 15KB (reduced from 2MB)
  if (approxBytes > MAX_SIZE_BYTES) {
    return false;
  }
  
  return true;
};

exports.getAllStudents = async (req, res) => {
  try {
    // Optionally exclude the 'photo' field for better performance in list view
    // const students = await Student.find().select('-photo');
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { photo, ...otherData } = req.body;
    
    // Validate photo if provided
    if (photo && !validatePhoto(photo)) {
      return res.status(400).json({ 
        message: 'Invalid photo: must be a valid image (JPEG/PNG/GIF/WebP) under 15KB.' 
      });
    }
    
    const student = await Student.create({ ...otherData, photo: photo || '' });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { photo, ...otherData } = req.body;
    
    // Validate photo if provided
    if (photo !== undefined && !validatePhoto(photo)) {
      return res.status(400).json({ 
        message: 'Invalid photo: must be a valid image (JPEG/PNG/GIF/WebP) under 15KB.' 
      });
    }
    
    // Build update object: only include photo if it was sent (could be empty string to remove)
    const updateData = { ...otherData };
    if (photo !== undefined) updateData.photo = photo;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};