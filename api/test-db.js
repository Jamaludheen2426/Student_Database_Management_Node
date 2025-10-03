const { Sequelize } = require('sequelize');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Log environment variables (without passwords)
    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      name: process.env.DB_NAME,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
      hasPassword: !!process.env.DB_PASS
    };

    console.log('Database config:', dbConfig);

    // Test database connection
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: console.log
      }
    );

    await sequelize.authenticate();
    console.log('Database connection successful');

    await sequelize.close();

    return res.status(200).json({
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      config: dbConfig
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        hasPassword: !!process.env.DB_PASS
      }
    });
  }
};