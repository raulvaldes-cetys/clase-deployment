# The Menu API

Backend API for The Menu - Online Food Ordering Web App

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (optional, defaults are set in code):

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key
PORT=3000
```

3. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

Base URL: `http://localhost:3000/api/users`

### User Operations

#### 1. Register a new user

- **POST** `/api/users/register`
- **Body:**

```json
{
  "userId": "user123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "userId": "user123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "_id": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. Login user

- **POST** `/api/users/login`
- **Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get all users

- **GET** `/api/users`
- **Response:**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "users": [ ... ]
  }
}
```

#### 4. Get user by ID

- **GET** `/api/users/:userId`
- **Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... }
  }
}
```

#### 5. Update user

- **PUT** `/api/users/:userId`
- **Body:** (all fields optional)

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "newpassword123"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": { ... }
  }
}
```

#### 6. Delete user

- **DELETE** `/api/users/:userId`
- **Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Database Schema

### User Model

- `userId` (String, unique, required) - Primary identifier
- `firstName` (String, required)
- `lastName` (String, required)
- `email` (String, unique, required)
- `password` (String, required, min 6 characters) - Hashed with bcrypt
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Features

- Password hashing with bcrypt
- JWT token generation for authentication
- Password excluded from JSON responses
- Input validation
- Error handling
- MongoDB integration

## Technology Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing
