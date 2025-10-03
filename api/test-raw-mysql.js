module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Try to require mysql2 directly
    let mysql2;
    try {
      mysql2 = require('mysql2/promise');
      console.log('mysql2 package loaded successfully');
    } catch (error) {
      console.error('Failed to load mysql2:', error);
      return res.status(500).json({
        error: 'mysql2 package not available',
        message: error.message,
        suggestion: 'Try installing mysql2 package'
      });
    }

    // Test raw connection
    const connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('Raw MySQL connection established');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Test query successful:', rows);
    
    await connection.end();

    return res.status(200).json({
      message: 'Raw MySQL connection successful!',
      timestamp: new Date().toISOString(),
      testResult: rows[0],
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        hasPassword: !!process.env.DB_PASS
      }
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      stack: error.stack,
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        hasPassword: !!process.env.DB_PASS
      }
    });
  }
};