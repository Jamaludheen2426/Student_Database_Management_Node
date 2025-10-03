module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    message: 'Student Database Management API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    availableEndpoints: {
      health: 'GET /api',
      hello: 'GET /api/hello',
      getAllStudents: 'GET /api/students',
      addStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students?id=:id',
      deleteStudent: 'DELETE /api/students?id=:id',
      deleteAllStudents: 'DELETE /api/students'
    }
  });
};
