const mysql2 = require('mysql2/promise');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let connection;
  try {
    console.log('Starting students API request...');
    
    // Get database connection
    connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Database connection established');

    // Create table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(255) NOT NULL,
        Mark INT NOT NULL,
        Active VARCHAR(1) DEFAULT 'T'
      )
    `);

    console.log('Table creation checked');

    // Handle GET request only for now
    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM students ORDER BY Id');
      console.log('Query executed, rows found:', rows.length);
      
      return res.status(200).json({
        message: 'Students retrieved successfully',
        count: rows.length,
        data: rows
      });
    }

    return res.status(405).json({ error: 'Method not allowed in simple version' });

  } catch (error) {
    console.error('Students API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};