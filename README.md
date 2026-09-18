# Student Management System — Backend

Node.js + Express + MongoDB backend powering a role-based student management system, with JWT authentication and admin/student access control.

Live: https://student-management-system-backend-15ie.onrender.com

## Features

- **JWT-based authentication** — register and login with hashed passwords (bcrypt)
- **Role-based access control** — `admin` and `student` roles with route-level `protect` and `authorize` middleware
- **Course management (CRUD)**
  - Admins can create, view, and delete courses
  - Students have read-only access to the course catalog
- **Student profiles & academic records**
  - Auto-generated `studentId` and a `Student` profile created on registration
  - Admins can view all students (with populated user + course data) and assign/update grades, scores, and enrollment status
  - Students can view their own populated profile and academic performance
- **`/api/auth/init-profiles`** utility route to backfill `Student` profiles for any legacy `student` users missing one

## Tech Stack

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs for password hashing
- CORS

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── auth.js                # JWT verification (protect) + role authorization (authorize)
├── models/
│   ├── User.js                 # User schema (name, email, password, role)
│   ├── Student.js              # Student profile schema (studentId, major, academicPerformance[])
│   └── Course.js               # Course schema (title, code, credits)
├── routes/
│   ├── auth.js                  # /api/auth/register, /api/auth/login, /api/auth/init-profiles
│   ├── courses.js               # /api/courses (CRUD, role-protected)
│   └── students.js              # /api/students (profiles, grade assignment, role-protected)
└── server.js                    # App entry point
```

## API Endpoints

| Method | Endpoint                    | Access             | Description                                         |
|--------|------------------------------|--------------------|-------------------------------------------------------|
| POST   | `/api/auth/register`         | Public             | Register a new user (creates a `Student` profile too if role is `student`) |
| POST   | `/api/auth/login`            | Public             | Login and receive JWT token                          |
| GET    | `/api/auth/init-profiles`    | Public              | Backfill `Student` profiles for legacy student users  |
| GET    | `/api/courses`               | Authenticated       | Get all courses                                       |
| POST   | `/api/courses`               | Admin only          | Create a new course                                    |
| DELETE | `/api/courses/:id`           | Admin only          | Delete a course                                         |
| GET    | `/api/students`              | Admin only          | Get all students with populated user + academic records |
| GET    | `/api/students/profile`      | Student only        | Get the logged-in student's own profile                 |
| POST   | `/api/students/:id/grade`    | Admin only          | Assign or update a grade/score/status for a student's course |

## Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/18pb/student-management-system-backend.git
   cd student-management-system-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server
   ```bash
   node server.js
   ```
   The server runs on `http://localhost:5000` by default.

## Frontend

Pairs with [student-management-system-frontend](https://github.com/18pb/student-management-system-frontend), which consumes this API for login/registration and the admin/student dashboards.

## Notes

- Password hashing is handled automatically via a Mongoose pre-save hook on `User`.
- Ensure MongoDB is running (locally or via a cloud provider like MongoDB Atlas) before starting the server.
- CORS is enabled for cross-origin requests from the frontend.
