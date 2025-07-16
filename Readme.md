# Coffee Shop App (Backend)

Backend API for Coffee Shop App using Node.js, Express, and MySQL.

## Features
- User authentication (JWT)
- CRUD products
- Order management
- Role-based access (admin, user)

## Tech Stack
- Node.js
- Express.js
- MySQL

## Installation

## Library
- express
- mysql2
- uuid
- multer
- jsonwebtoken
- nodemon
- bcrypt
- cors
- dotenv

## Query SQL
CREATE TABLE users (
    iduser VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    photo VARCHAR(255) NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
