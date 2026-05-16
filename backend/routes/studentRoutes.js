const express = require('express');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.route('/')
  .get(auth, getAllStudents)
  .post(auth, roleCheck('admin', 'verifier'), createStudent);

router.route('/:id')
  .get(auth, getStudentById)
  .put(auth, roleCheck('admin', 'verifier'), updateStudent)
  .delete(auth, roleCheck('admin'), deleteStudent);

module.exports = router;