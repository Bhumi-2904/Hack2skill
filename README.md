# Hack2Skill – Campus Event Reminder & AI Assistant

Hack2Skill is a full-stack web application designed to help students discover campus events while allowing admins to create and manage events easily.  
The platform integrates Firebase for authentication and data storage, and a Node.js backend for AI-powered features (Vecna Voice).

---

## 🚀 Features

### 👩‍🎓 Student Features
- Secure login & signup using Firebase Authentication
- View all upcoming campus events
- Clean, responsive UI for desktop and mobile
- Event details fetched in real time from Firestore

### 🧑‍💼 Admin Features
- Admin-only login
- Create new campus events
- Manage and delete existing events
- AI-powered event description / voice features via backend

### 🤖 AI Backend (Vecna Voice)
- Node.js + Express backend
- Handles AI-related logic securely
- Environment-variable based API key management
- Deployed separately for scalability

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- Firebase Hosting

### Backend
- Node.js
- Express.js
- REST APIs

### Database & Auth
- Firebase Authentication
- Firebase Firestore

### Deployment
- Frontend: Firebase Hosting
- Backend: Render
- Version Control: Git & GitHub

---

## 📁 Project Structure

```Project-Hack2Skill/
├── js/
│ ├── admin.js
│ ├── auth.js
│ ├── events.js
│ └── firebase.js
├── public/
├── server.js
├── package.json
├── package-lock.json
├── index.html
├── login.html
├── signup.html
├── admin.html
├── style.css
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md