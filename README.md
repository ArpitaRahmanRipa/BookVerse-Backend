# BookVerse Backend

Shared backend API for the BookVerse social reading and book discovery platform.

## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## Current Features

### Reading Progress and Diary Management

- Create reading progress
- Get reading progress
- Update reading progress
- Delete reading progress

### Follow System and Reader Connections

- Follow a reader
- View following list
- View followers list
- Unfollow a reader

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Run the server:

```bash
node server.js
```