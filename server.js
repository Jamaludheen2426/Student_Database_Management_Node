require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./src/config/db.config');           
const studentRoutes = require('./src/route/student.route');
const cors = require('cors');

app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5001',
      'https://student-database-management-node.vercel.app',
      'https://student-database-management-next-js.vercel.app',
      'https://student-database-management-node-ng.vercel.app'
    ];
    
    // Allow all Vercel preview deployments
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow localhost with any port
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Student Database Management API is running', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Add a route for /student to match your deployed URL
app.get('/student', (req, res) => {
  res.status(200).json({ 
    message: 'Student endpoint is active. Use /students for API operations', 
    availableEndpoints: {
      getAllStudents: 'GET /students',
      addStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id',
      deleteAllStudents: 'DELETE /students'
    }
  });
});

app.use('/students', studentRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Handle 404 - Route not found
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    message: `Cannot ${req.method} ${req.originalUrl}` 
  });
});

// Start server for both development and production
db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB:', err);
  });

module.exports = app;
