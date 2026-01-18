# Hack2Skill – Campus Event Reminder & AI Assistant

Hack2Skill is a full-stack web application built to centralize campus event discovery for students and provide administrators with an efficient dashboard to create and manage events.  
The platform integrates Firebase for authentication and real-time data storage, along with a Node.js backend that powers AI-based event description generation.

---

## 🎯 Problem Statement

In many college campuses, event information is scattered across WhatsApp groups, notice boards, and social media platforms. This leads to poor visibility, missed events, and inefficient coordination.

Hapnin (Campus-Event-Reminder) solves this by offering a single, centralized platform where:
- Students can view all upcoming events
- Admins can manage events easily
- AI assists in generating professional event descriptions

---

## 💡 Solution Overview

Hapnin is a role-based system with two main user flows:

- **Students** can sign up, log in, and browse upcoming campus events.
- **Admins** can log in to an admin dashboard where they can create, view, and delete events using AI-assisted descriptions.

The frontend and backend are deployed separately to ensure scalability, security, and maintainability.

---

## 🚀 Key Features

### 👩‍🎓 Student Features
- Secure login and signup using Firebase Authentication
- View all upcoming campus events
- Clean, responsive UI optimized for desktop and mobile
- Real-time event updates from Firebase Firestore

### 🧑‍💼 Admin Features
- Role-based admin access
- Create new campus events
- View and delete existing events
- AI-powered event description generation

### 🤖 AI Integration
- Node.js and Express backend
- AI generates structured and complete event descriptions
- API keys secured using environment variables
- Backend deployed independently from frontend

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

### Authentication & Database
- Firebase Authentication
- Firebase Firestore

### Deployment
- Frontend: Firebase Hosting
- Backend: Render
- Version Control: Git & GitHub

---

## 📂 Project Structure

```PROJECT-HACK2SKILL/
├── public/
│ ├── js/
│ │ ├── admin.js # Admin dashboard logic
│ │ ├── auth.js # Authentication logic
│ │ ├── events.js # Event listing logic
│ │ ├── events-guard.js # Route protection for events page
│ │ ├── firebase.js # Firebase configuration
│ │ ├── landing.js # Landing page interactions
│ │ └── navbar.js # Navbar logic
│ │
│ ├── 404.html # Custom 404 page
│ ├── admin.html # Admin dashboard page
│ ├── events.html # Events listing page
│ ├── index.html # Landing page
│ ├── login.html # Login page
│ ├── signup.html # Signup page
│ ├── style.css # Global styles
│
├── .firebase/ # Firebase hosting cache
├── .firebaserc # Firebase project config
├── firebase.json # Firebase hosting rules
├── server.js # Node.js backend (AI services)
├── package.json
├── package-lock.json
├── .gitignore
├── .env # Environment variables (not committed)
└── README.md

---

## 🔐 Security & Best Practices

- Sensitive API keys stored in `.env` files
- Role-based access control for admin routes
- Backend isolated from frontend to protect AI keys
- Firebase Authentication and Firestore rules enforced

---

## 🌐 Deployment Architecture

- **Frontend** deployed on Firebase Hosting
- **Backend** deployed on Render
- GitHub integration enables automatic redeployment on code updates

---

## 📌 Future Enhancements

- Event search and category filtering
- Notification and reminder system
- AI voice-based event summaries
- Analytics dashboard for admins

---

## 👤 Team / Author

Developed as part of **VibeScript**, demonstrating full-stack development, cloud deployment, authentication, and AI integration using modern web technologies.

---

## 🏁 Conclusion

 VibeScript presents a scalable and practical solution to a real-world campus problem by combining secure authentication, real-time data handling, role-based access, and AI-powered features in a clean and user-friendly application.
