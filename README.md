# Student Management System — Backend

Node.js + Express + MongoDB backend powering a role-based student management system, with JWT authentication and admin/student access control.

## Features

- **JWT-based authentication** — register and login with hashed passwords (bcrypt)
- **Role-based access control** — `admin` and `student` roles with route-level authorization middleware
- **Course management (CRUD)**
  - Admins can create, view, and delete courses
  - Students have read-only access to the course catalog
- **Protected API routes** using custom `protect` and `authorize` middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs for password hashing
- CORS

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js             # JWT verification + role authorization
├── models/
│   ├── User.js              # User schema (name, email, password, role)
│   └── Course.js            # Course schema (title, code, credits)
├── routes/
│   ├── auth.js               # /api/auth/register, /api/auth/login
│   └── courses.js            # /api/courses (CRUD, role-protected)
└── server.js                 # App entry point
```

## API Endpoints

| Method | Endpoint              | Access         | Description                  |
|--------|-----------------------|----------------|-------------------------------|
| POST   | `/api/auth/register`  | Public         | Register a new user           |
| POST   | `/api/auth/login`     | Public         | Login and receive JWT token    |
| GET    | `/api/courses`        | Authenticated  | Get all courses                |
| POST   | `/api/courses`        | Admin only     | Create a new course             |
| DELETE | `/api/courses/:id`    | Admin only     | Delete a course                  |

## Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/18pb/<backend-repo-name>.git
   cd <backend-repo-name>
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

## Notes

- Password hashing is handled automatically via a Mongoose pre-save hook.
- Ensure MongoDB is running (locally or via a cloud provider like MongoDB Atlas) before starting the server.
- CORS is enabled for cross-origin requests from the frontend.
