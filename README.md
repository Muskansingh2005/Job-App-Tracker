# ApplyFlow - Job Application Tracker

ApplyFlow is a MERN stack app for tracking job applications with authentication, status-based workflow, and dashboard insights.

## Features
- User authentication (register/login)
- Dashboard with statistics
- Add, edit, delete job applications
- Search and filter by status

## Tech Stack
- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose

## Setup

### 1) Backend
1. Copy environment variables:
   - Create a file at backend/.env using backend/.env.example as a template.
2. Install dependencies:
   - Run: npm install
3. Start the API server:
   - Run: npm run dev

### 2) Frontend
1. Copy environment variables:
   - Create a file at frontend/.env using frontend/.env.example as a template.
2. Install dependencies:
   - Run: npm install
3. Start the web app:
   - Run: npm run dev

## Notes
- The API server runs on PORT from backend/.env (default 5000).
- The frontend uses VITE_API_URL from frontend/.env to connect to the API.
