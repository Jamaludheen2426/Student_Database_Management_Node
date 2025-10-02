require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const db = require('./src/config/db.config');           
const studentRoutes = require('./src/route/student.route');
const cors = require('cors');

app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5001','https://student-database-management-node.vercel.app','https://student-database-management-next-js.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use('/students', studentRoutes);

db.connect()
  .then(() => {
      app.listen(port, () => {
          console.log(`Server running on port ${port}`);
      });
  })
  .catch(err => {
      console.error('Failed to connect to DB:', err);
  });
