# Auth JWT 1

A Node.js backend project implementing user authentication with JWT, password hashing, and password reset functionality.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Password reset via token
- Protected routes
- MongoDB integration with Mongoose

## Project Structure

```
.env
app.js
package.json
config/
  connectdb.js
controllers/
  userController.js
middlewares/
  auth-middleware.js
models/
  User.js
routes/
  userRoutes.js
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository.
2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up your `.env` file:

   ```
   PORT=8000
   DATABASE_URL=mongodb://127.0.0.1:27017
   JWT_SECRET=your_jwt_secret
   ```

### Running the Server

- For development (with nodemon):

  ```sh
  npm run dev
  ```

- For production:

  ```sh
  npm start
  ```

## API Endpoints

- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — Login user
- `POST /api/user/sendpasswordresetlink` — Send password reset link
- `POST /api/user/resetpassword/:id/:token` — Reset password
- `POST /api/user/changepassword` — Change password (protected)
- `GET /api/user/loggeduser` — Get logged-in user