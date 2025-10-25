# CollabHub 
<div align="center">

A Modern Platform for Project Collaboration and Team Building

</div>

## Table of Contents

-Overview
-Features
-Tech Stack
-Getting Started
-Prerequisites
-Installation
-Environment Variables
-Project Structure
-Deployment
-Contributing
-License
-Contact


## Overview
CollabHub is a comprehensive project collaboration platform designed to connect developers, designers, and creators. It enables users to discover projects that match their skills, form teams, manage tasks with Kanban boards, and communicate seamlessly through integrated chat features.
## Problem Statement
Finding the right team members for projects and managing collaboration can be challenging. CollabHub solves this by providing:

Intelligent project matching based on skills and interests
Streamlined team formation with join request workflows
Integrated project management tools
Real-time communication features

## Key Highlights

Smart Matching Algorithm: Suggests projects based on user skills and preferences
Collaborative Workspace: Kanban boards, task management, and team chat
Gamification: XP system and badges to encourage participation
Responsive Design: Fully functional across desktop, tablet, and mobile devices


## Features
### User Management

Authentication: Secure JWT-based authentication with bcrypt password hashing
User Profiles: Customizable profiles with skills, links, and preferences
Onboarding Flow: Multi-step onboarding to capture user interests and skills
Profile Discovery: Browse and view other users' profiles

### Project Management

Create Projects: Rich project creation with cover images (Cloudinary integration)
Project Discovery: Browse, search, and filter projects by category, tech stack, and status
Join Requests: Send and manage join requests with custom messages
Team Management: Accept/reject requests, manage team members and roles
Project Status: Track project lifecycle (OPEN, ACTIVE, COMPLETED)

### Task Management

Kanban Board: Drag-and-drop task management with three columns (TODO, IN_PROGRESS, DONE)
Task Creation: Create tasks with titles, descriptions, and assignees
Progress Tracking: Visual progress bars and metrics
Real-time Updates: Instant task status updates

### Communication

Project Chat: Real-time messaging within project teams
Join Request Messages: Communicate intentions when requesting to join
Team Coordination: Centralized communication hub for each project

### Discovery & Matching

Smart Recommendations: AI-powered project suggestions based on skills and preferences
Advanced Filtering: Filter by category, status, tech stack, and search terms
Bookmarking: Save interesting projects for later
Leaderboards: Track top projects and contributors

### Gamification

Experience Points (XP): Earn XP for contributions and activities
Badges: Collect achievement badges
Contributor Rankings: Leaderboard of top contributors by XP
Project Rankings: Monthly rankings of most active projects


## Tech Stack
Frontend

Framework: React 18.x with Vite
Routing: React Router DOM v6
State Management: Context API (Auth & App contexts)
Data Fetching: TanStack Query (React Query)
UI Components: shadcn/ui + Radix UI primitives
Styling: Tailwind CSS
Form Handling: React Hook Form
Notifications: Sonner (toast notifications)
Icons: Lucide React
HTTP Client: Native Fetch API

Backend

Runtime: Node.js 18.x
Framework: Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (jsonwebtoken)
Password Hashing: bcrypt
File Upload: Multer + Cloudinary (image hosting)
CORS: cors middleware
Security: cookie-parser, helmet (recommended)

 DevOps & Deployment

Frontend Hosting: Netlify
Backend Hosting: Render
Database: MongoDB Atlas
Image Storage: Cloudinary
Version Control: Git
CI/CD: Netlify & Render auto-deployment


## Getting Started
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18.x or higher) - Download
npm (v9.x or higher) - Comes with Node.js
MongoDB Atlas Account - Sign up
Cloudinary Account - Sign up
Git - Download

Installation

Clone the repository

bash   git clone https://github.com/yourusername/collabhub.git
   cd collabhub

Install server dependencies

bash   cd server
   npm install

Install client dependencies

bash   cd ../client
   npm install
Environment Variables
Server Configuration
Create a .env file in the server directory:
env# Server Configuration
PORT=4000

## Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/collabhub?retryWrites=true&w=majority

## JWT Secrets (Generate secure random strings)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_too

## Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
To generate secure JWT secrets:
bash# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

## Or using OpenSSL
openssl rand -base64 64
Client Configuration
Create a .env file in the client directory:
env# API Configuration
VITE_API_BASE_URL=http://localhost:4000
For production:
envVITE_API_BASE_URL=https://collabhub-fdy7.onrender.com
Running the Application
Development Mode

Start the backend server

bash   cd server
   npm run dev
Server will run on http://localhost:4000

Start the frontend (in a new terminal)

bash   cd client
   npm run dev
Client will run on http://localhost:5173

Access the application

Frontend: http://localhost:5173
Backend API: http://localhost:4000



Production Build
Client:
bashcd client
npm run build
This creates an optimized production build in the dist folder.
Server:
bashcd server
npm start
```

---

## Project Structure
```
collabhub/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   │   └── placeholder.svg
│   ├── src/
│   │   ├── api/                     # API client and services
│   │   │   └── client.js           # Centralized API calls
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── FilterBar.jsx
│   │   │   ├── JoinRequestPanel.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── LeaderboardList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NewProjectDialog.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── RequireAuth.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TeamList.jsx
│   │   ├── context/                 # React Context providers
│   │   │   ├── AppContext.jsx      # Global app state
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-mobile.jsx
│   │   │   └── use-toast.js
│   │   ├── lib/                     # Utility functions
│   │   │   └── utils.js
│   │   ├── pages/                   # Route pages
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # App entry point
│   ├── .env.sample                 # Environment variables template
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies and scripts
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── vite.config.js              # Vite configuration
│
├── server/                          # Backend Express application
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   │   ├── cloudinary.js       # Cloudinary setup
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/             # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── leaderboardController.js
│   │   │   ├── matchController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── userController.js
│   │   ├── middleware/              # Express middleware
│   │   │   └── authMiddleware.js   # JWT authentication
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── Message.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   └── User.js
│   │   ├── routes/                  # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── leaderboardRoutes.js
│   │   │   ├── matchRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── .env                         # Environment variables (not in git)
│   └── package.json                 # Dependencies and scripts
│
└── README.md                        # This file



## Deployment
### Live URLs

Frontend: https://project-name-colabhub.netlify.app
Backend API: https://collabhub-fdy7.onrender.com

Deploying to Netlify (Frontend)

Build the client

bash   cd client
   npm run build
```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL=https://collabhub-fdy7.onrender.com`

3. **Configure redirects**
   Create `client/public/_redirects`:
```
   /* /index.html 200
Deploying to Render (Backend)

Create a new Web Service on Render

Connect your GitHub repository
Select the server directory as root
Set build command: npm install
Set start command: npm start


Add Environment Variables in Render dashboard:

MONGO_URI
JWT_SECRET
JWT_REFRESH_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET


Deploy and copy the service URL

MongoDB Atlas Setup

Create a cluster on MongoDB Atlas
Create a database user
Whitelist IP addresses (or use 0.0.0.0/0 for all IPs)
Get your connection string and add it to .env as MONGO_URI

Cloudinary Setup

Sign up at Cloudinary
Get your cloud name, API key, and API secret from the dashboard
Add credentials to server .env file





## License
Distributed under the MIT License. See LICENSE file for more information.

## Contact
Project Link: https://github.com/Lekhana-Dinesh/collabhub
Live Demo: https://project-name-colabhub.netlify.app

## Acknowledgments

React
Express.js
MongoDB
Tailwind CSS
shadcn/ui
Cloudinary
Render
Netlify

