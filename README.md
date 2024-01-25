# Node.js RESTful API - Note Taking App

## Overview

This project is a RESTful API built with Node.js, Express, MongoDB, and TypeScript. It serves as the backend for a simple note-taking application, allowing users to perform CRUD operations on their notes with authentication.

## Requirements

- Node.js and npm installed

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/chriswudev/note-taking-app.git
   cd note-taking-app
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following:

   ```bash
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/noteApp
   JWT_SECRET=your_secret_key
   ```
   Replace `your_secret_key` with a strong secret key for JWT signing and update `MONGODB_URI` with your own connection URI.

4. **Build the TypeScript code:**

   ```bash
   npm run build
   ```

5. **Start the server:**

   ```bash
   npm start
   ```
   or for development with nodemon:

   ```bash
   npm run dev
   ```
   The server should be running at `http://localhost:3000`.

6. **Run Test:**

   ```bash
   npm run test
   ```

## API Endpoints

### User Authentication
- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: Log in with an existing user.
### Note Operations
- **POST** `/notes`: Create a new note.
- **GET** `/notes`: Get all notes for the authenticated user.
   - **GET** `/notes?search=your_query`: Search notes by title, body, or tags.
- **GET** `/notes/:id`: Get a specific note by ID.
- **PUT** `/notes/:id`: Update a specific note by ID.
- **DELETE** `/notes/:id`: Delete a specific note by ID.