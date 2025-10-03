const mysql2 = require('mysql2/promise');

// Helper to parse request body
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

  let connection;
  try {
    // Get database connection with timeout
    connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306'),
      connectTimeout: 10000,
      acquireTimeout: 10000,
    });

    const { method } = req;
    const { id } = req.query;

    // Parse body for POST/PUT
    if (method === 'POST' || method === 'PUT') {
      req.body = await parseBody(req);
    }

    switch (method) {
      case 'GET':
        if (id) {
          const [rows] = await connection.execute(
            'SELECT * FROM students WHERE Id = ?',
            [id]
          );
          if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }
          return res.status(200).json(rows[0]);
        } else {
          const [rows] = await connection.execute('SELECT * FROM students ORDER BY Id LIMIT 100');
          return res.status(200).json(rows);
        }

      case 'POST':
        const { Name, Mark, Active } = req.body;
        if (!Name || Mark === undefined) {
          return res.status(400).json({ error: 'Name and Mark are required' });
        }
        const [result] = await connection.execute(
          'INSERT INTO students (Name, Mark, Active) VALUES (?, ?, ?)',
          [Name, parseInt(Mark), Active || 'T']
        );
        return res.status(201).json({
          message: 'Student created successfully',
          id: result.insertId,
          student: { Id: result.insertId, Name, Mark: parseInt(Mark), Active: Active || 'T' }
        });

      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Student ID is required' });
        }
        const updateData = req.body;
        const updateFields = [];
        const updateValues = [];
        
        if (updateData.Name) {
          updateFields.push('Name = ?');
          updateValues.push(updateData.Name);
        }
        if (updateData.Mark !== undefined) {
          updateFields.push('Mark = ?');
          updateValues.push(parseInt(updateData.Mark));
        }
        if (updateData.Active) {
          updateFields.push('Active = ?');
          updateValues.push(updateData.Active);
        }
        
        if (updateFields.length === 0) {
          return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateValues.push(id);
        const [updateResult] = await connection.execute(
          `UPDATE students SET ${updateFields.join(', ')} WHERE Id = ?`,
          updateValues
        );
        
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Student not found' });
        }
        
        return res.status(200).json({ message: 'Student updated successfully' });

      case 'DELETE':
        if (id) {
          const [deleteResult] = await connection.execute(
            'DELETE FROM students WHERE Id = ?',
            [id]
          );
          if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }
          return res.status(200).json({ message: 'Student deleted successfully' });
        } else {
          const [deleteResult] = await connection.execute('DELETE FROM students');
          return res.status(200).json({ 
            message: 'All students deleted successfully',
            deletedCount: deleteResult.affectedRows
          });
        }

      default:
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }

  } catch (error) {
    console.error('Students API Error:', error);
    return res.status(500).json({
      error: 'Database operation failed',
      message: error.message
    });
  } finally {
    if (connection) {
      await connection.end().catch(console.error);
    }
  }
};