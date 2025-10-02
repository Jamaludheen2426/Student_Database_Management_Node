const express = require('express');
const app = express.Router();
const StudentController = require('../controller/student.controller');

app.get('/',StudentController.getAllStudents);
app.post('/',StudentController.addNewStudent);
app.delete('/',StudentController.DeleteStudents);
app.put('/:id',StudentController.UpdateStudents);
app.delete('/:id',StudentController.DltStudentById);

module.exports = app;