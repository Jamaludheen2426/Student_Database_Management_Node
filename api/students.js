const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);

// Student model
const Student = sequelize.define('Student', {
  Id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  Mark: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  Active: {
    type: Sequelize.STRING,
    defaultValue: 'T'
  }
}, {
  tableName: 'students',
  timestamps: false
});

// Helper function to parse request body
const parseBody = (req) => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse request body for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body = await parseBody(req);
  }

  try {
    // Ensure database connection
    await sequelize.authenticate();
    await sequelize.sync();

    const { method } = req;
    const { id } = req.query;

    switch (method) {
      case 'GET':
        if (id) {
          const student = await Student.findByPk(id);
          if (!student) {
            return res.status(404).json({ error: 'Student not found' });
          }
          return res.status(200).json(student);
        } else {
          const students = await Student.findAll();
          return res.status(200).json(students);
        }

      case 'POST':
        const { Name, Mark, Active } = req.body;
        if (!Name || !Mark) {
          return res.status(400).json({ error: 'Name and Mark are required' });
        }
        const newStudent = await Student.create({ Name, Mark, Active: Active || 'T' });
        return res.status(201).json(newStudent);

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Student ID is required' });
        }
        const updateData = req.body;
        const [updatedRows] = await Student.update(updateData, {
          where: { Id: id }
        });
        if (updatedRows === 0) {
          return res.status(404).json({ error: 'Student not found' });
        }
        return res.status(200).json({ message: 'Student updated successfully' });

      case 'DELETE':
        if (id) {
          const deletedRows = await Student.destroy({
            where: { Id: id }
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }
          return res.status(200).json({ message: 'Student deleted successfully' });
        } else {
          await Student.destroy({ where: {}, truncate: true });
          return res.status(200).json({ message: 'All students deleted successfully' });
        }

      default:
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};