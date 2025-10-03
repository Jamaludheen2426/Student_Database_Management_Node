const express = require('express');
const cors = require('cors');

const app = express();

// Basic CORS setup
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Database Management API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Student info endpoint  
app.get('/student', (req, res) => {
  res.status(200).json({
    message: 'Student endpoint is active',
    availableEndpoints: {
      health: 'GET /',
      studentInfo: 'GET /student',  
      getAllStudents: 'GET /students',
      addStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id',
      deleteAllStudents: 'DELETE /students'
    }
  });
});

// Export for Vercel
module.exports = app;
