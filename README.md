Backend Project Description

Student Management System Backend
Node.js backend using Express and Sequelize ORM. Provides REST APIs for full CRUD operations on students with MySQL database. Handles endpoints for create, read, update, delete, and bulk delete. Designed to integrate seamlessly with a Next.js frontend using React Query.

Steps to Run the Backend Environment
1️⃣ Clone the Repository
git clone https://github.com/Jamaludheen2426/Student_Database_Management_Node.git
cd Student_Database_Management_Node

2️⃣ Install Dependencies
npm install


This will install:

express for routing

sequelize and mysql2 for ORM + database

cors, dotenv etc.

3️⃣ Setup Environment Variables

Create a .env file in the root folder:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_db
DB_PORT=3306
PORT=5000


Replace your_mysql_password with your MySQL root password.

DB_NAME will be created automatically if your Sequelize setup allows it, or create it manually in MySQL.

4️⃣ Create MySQL Database
CREATE DATABASE student_db;

5️⃣ Run Database Migrations / Sync

If your service uses sequelize.sync():

node src/config/db.config.js


Or if you have a sync.js script:

node sync.js


This will create the Student table with columns: Id, Name, Mark, Active.

6️⃣ Start the Server
npm run dev


Server will run on the port from .env (default 5000)

API endpoints:

GET /students → fetch all students

POST /students → add new student

PUT /students/:id → update student

DELETE /students/:id → delete student

DELETE /students → delete all students

7️⃣ Test APIs

Use Postman or Insomnia to test endpoints, e.g.,

POST /students
{
  "Name": "John Doe",
  "Mark": 85,
  "Active": "T"
}


✅ After this, your backend is ready and can connect to the Next.js frontend via React Query.

If you want, I can also write a ready .env.example and instructions for frontend integration for this backend. This makes it fully plug-and-play.
