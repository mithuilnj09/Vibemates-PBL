# 🎓 VibeMates — Peer-to-Peer Learning System

> **“Learn Together. Grow Together.”**  
> A smart, responsive peer-to-peer study partner matching and collaborative learning platform designed for college students.

---

## 🌟 Overview

Instead of students posting randomly on WhatsApp or Discord asking for study buddies, **VibeMates** uses a multi-attribute compatibility algorithm to intelligently match students based on:

- **Subjects to Learn & Teach** (30% weight)
- **Weekly Schedule & Time Slots** (25% weight)
- **Skill Level Synergy** (15% weight)
- **Learning Pace Compatibility** (15% weight)
- **Learning Style Synergy** (15% weight)

Matched students can connect, chat in real-time, join study groups, and launch virtual study rooms equipped with Pomodoro timers and collaborative scratchpads.

---

## 🚀 Key Features

1. **Smart Matching Algorithm**: Calculates compatibility percentage and provides detailed breakdowns.
2. **Find Mates Directory**: Multi-faceted filtering by subject, skill level, pace, style, day, and minimum match score.
3. **Connection System**: Send requests with personal notes, accept/decline, with confetti celebration upon becoming VibeMates!
4. **Real-Time Chat**: Live peer messaging with WebSockets, typing indicators, emojis, and instant session scheduling directly from the conversation.
5. **Study Session Scheduler**: Schedule 1-on-1 or group study sprints with calendar countdowns.
6. **Virtual Study Room**: Interactive Pomodoro focus timer (25 min study / 5 min break), goal checklist, shared collaborative notes, and video call simulation.
7. **Study Groups**: Explore cohorts like *Java Beginners (32 members)*, *DSA Squad (48 members)*, and *Machine Learning Cohort (25 members)*.
8. **1-Click Demo Switcher**: Instant evaluation tool in the navigation bar to switch between student accounts (Arun, Rahul, Priya, Karthik, Ananya) to experience both sides of peer connections in real time.
9. **Zero-Setup Resilience**: Dual-mode database layer — connects to MongoDB when available or runs seamlessly on the built-in smart in-memory store so anyone can evaluate it immediately with zero configuration!

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express.js, Socket.io (WebSockets)
- **Database**: MongoDB with Mongoose (with automated smart fallback)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs password hashing

---

## 📁 Project Structure

```
Vibemates PBL/
├── client/                     # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, StudentCard, MatchBadge, ScheduleMatrix, etc.
│   │   ├── context/            # AuthContext, SocketContext
│   │   ├── pages/              # Landing, Login, SignUp, Dashboard, FindMates, Chat, Sessions, Groups, Profile, About, Contact
│   │   ├── services/           # API helper methods
│   │   ├── App.jsx             # Main router
│   │   ├── index.css           # Design tokens & glassmorphism
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connector with intelligent fallback
│   ├── middleware/
│   │   └── auth.js             # JWT Bearer token authentication
│   ├── models/                 # Mongoose schemas: User, Connection, Message, StudySession, StudyGroup, Notification
│   ├── routes/                 # Express API routes
│   ├── utils/
│   │   ├── matchingAlgorithm.js # Compatibility mathematical scoring model
│   │   ├── memoryStore.js       # Pre-seeded fallback data engine
│   │   └── seedData.js          # MongoDB seeder script
│   ├── package.json
│   ├── .env.example
│   └── server.js               # Server entry point + Socket.io
├── scripts/
│   ├── test_api.ps1            # 8-step full-stack verification script
│   └── setup_node.ps1          # Node.js portable installer for Windows
└── README.md
```

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- **Node.js** v18+ and **npm** v9+ installed.

---

### 2. Installing Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

---

### 3. Setting Up Environment Variables

Inside the `server/` directory, create a `.env` file (copied from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vibemates
JWT_SECRET=vibemates_super_secret_jwt_key_2026_peer_learning
NODE_ENV=development
```

> **Note**: If MongoDB is not running locally, VibeMates automatically boots in **Smart In-Memory Mode** populated with rich student profiles, chat history, and study groups.

---

### 4. Running Backend

From the `server/` directory:
```bash
npm start
# Or for auto-reload during development:
npm run dev
```
Backend will be live at: `http://localhost:5000/api`

---

### 5. Running Frontend

From the `client/` directory:
```bash
npm run dev
```
Frontend will be live at: `http://localhost:3000` (or `http://127.0.0.1:3000`)

---

### 6. Connecting & Seeding MongoDB (Optional)

If you have a local MongoDB Community server or a MongoDB Atlas cloud URI:
1. Ensure your MongoDB service is running (`mongod` or Atlas cloud URI).
2. Set `MONGODB_URI` in `server/.env`:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/vibemates
   # Or for Atlas:
   # MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/vibemates
   ```
3. Populate the database with realistic sample student data:
   ```bash
   cd server
   npm run seed
   ```

---

### 7. Testing the Application

Run the automated integration test script to verify all 8 full-stack subsystems:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test_api.ps1
```
This tests:
1. Frontend HTTP status
2. Backend health status
3. 1-Click demo authentication (JWT)
4. Matching algorithm & score calculations
5. Real-time chat messages
6. Study sessions & rooms
7. Study group cohorts
8. Live notifications & unread badges

---

### 8. Production Deployment

#### Single Full-Stack Bundle
You can build the frontend and serve it directly from the Express backend:

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Start the backend:
   ```bash
   cd ../server
   npm start
   ```
   Express will serve the complete app and all APIs from `http://localhost:5000`.

#### Deploying to Cloud (e.g. Render, Railway, Heroku, Vercel)
- **Backend (Render/Railway)**: Set root directory to `server/`, build command `npm install`, start command `npm start`. Set environment variables `MONGODB_URI` and `JWT_SECRET`.
- **Frontend (Vercel/Netlify)**: Set root directory to `client/`, build command `npm run build`, output directory `dist`. Set proxy or `VITE_API_URL` to your backend URL.

---

## 👥 Demo Student Accounts

Use the **"Demo Switcher"** button in the navigation bar for instant 1-click login:

| Student Name | College & Course | Focus Subjects | Key Strengths |
| :--- | :--- | :--- | :--- |
| **Arun Kumar** | NIT, CS 3rd Year | Java, DSA, DBMS | LeetCode Grinder, Java mentor |
| **Rahul Verma** | IIIT, IT 2nd Year | Python, ML, Math | Deep Learning, Neural Networks |
| **Priya Sharma** | DTU, SE 3rd Year | React, Web Dev, SQL | Full-Stack MERN, System Design |
| **Karthik Nair** | BITS Pilani, CS 4th Year | C++, Algorithms, DSA | Codeforces Candidate Master |
| **Ananya Patel** | VIT, AI & DS 2nd Year | Math, Python, Stats | Applied Linear Algebra & Data Viz |

*Password for all demo accounts:* `password123`

---

## 📄 License
This project is open-source under the MIT License. Built for student collaborative learning.
