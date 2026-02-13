# TaskManager - MERN Stack Application

A full-stack task management application with Role-Based Access Control (RBAC), JWT authentication, and Redis caching.

## 🚀 Live Demo

- Frontend: (https://task-manager-omega-inky-66.vercel.app)
- Backend API: (https://taskmanager-backend-lg28.onrender.com)

## 📋 Features

- 🔐 JWT Authentication with Access & Refresh Tokens
- 👥 Role-Based Access Control (User & Admin)
- ✅ Task CRUD Operations
- 📊 Dashboard with Statistics
- 🔍 Search & Filter Tasks
- ⚡ Redis Caching for Performance
- 🎨 Beautiful UI with TailwindCSS

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- Redis (Upstash) for caching
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React with Vite
- TailwindCSS for styling
- React Router v6
- Axios for API calls
- React Hot Toast for notifications

## 🏗️ Project Structure
├── backend/ # Express.js backend
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── config/
│ │ └── utils/
│ └── package.json
│
└── frontend/ # React frontend
├── src/
│ ├── components/
│ ├── pages/
│ ├── hooks/
│ ├── services/
│ ├── context/
│ └── utils/
└── package.json

text

## 🚀 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables:
NODE_ENV=production
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
REDIS_URL=your_upstash_redis_url
CLIENT_URL=https://your-frontend.vercel.app

text
5. Deploy!

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variable:
VITE_API_BASE_URL=https://your-backend.onrender.com/api

text
4. Deploy!

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=30m
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=3d
REDIS_URL=your_redis_url
REDIS_CACHE_TTL=600
CLIENT_URL=your_frontend_url

Frontend (.env)
env
VITE_API_BASE_URL=your_backend_url/api

📝 API Documentation
Auth Endpoints
POST /api/auth/register - Register new user

POST /api/auth/login - Login user

GET /api/auth/profile - Get user profile

POST /api/auth/logout - Logout user

POST /api/auth/refresh-token - Refresh access token

Task Endpoints
GET /api/task - Get user tasks

POST /api/task - Create task

GET /api/task/:id - Get single task

PUT /api/task/:id - Update task

DELETE /api/task/:id - Delete task

GET /api/task/stats - Get task statistics

Admin Endpoints
GET /api/admin/dashboard - Get admin dashboard stats

GET /api/admin/users - Get all users

GET /api/admin/tasks - Get all tasks

DELETE /api/admin/users/:id - Delete user

DELETE /api/admin/tasks/:id - Delete task

👨‍💻 Local Development
Clone repository

Install dependencies:

bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
Set up environment variables

Run development servers:

bash
# Backend
npm run dev

# Frontend
npm run dev
