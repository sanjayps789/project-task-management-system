# ProManage - Full Stack Project Management System

ProManage is a modern, responsive, and feature-rich Project Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). It helps teams and developers efficiently manage projects, track tasks, monitor progress metrics, and collaborate seamlessly.

---

## 🚀 Features

- **User Authentication**: Secure Login and Registration with JWT authentication, password hashing, and password visibility toggle.
- **Dashboard Overview**: Real-time stats cards (Total Projects, Total Tasks, Completed, In Progress, Pending) with recent projects and tasks overview.
- **Project Management**: Full CRUD operations with search, multi-filters (Status, Priority), and sorting (Newest, Due Date).
- **Task Management**: Project-specific and global task management with backend pagination, status updates, priority badges, and user assignment.
- **Interactive UI/UX**: Clean and modern interface styled with Tailwind CSS, React Toastify notifications, and SweetAlert2 confirmation dialogs.
- **Error Handling**: Responsive 404 Not Found page and global loader components for smooth user experience.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** (Vite)
- **Redux Toolkit** (State Management & Auth Persistence)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Routing & Protected Routes)
- **React Icons** & **SweetAlert2** / **React Toastify**

### **Backend**
- **Node.js** & **Express.js** (REST API)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & Security)

---

## ⚙️ Getting Started & Installation

### Prerequisites
Make sure you have installed:
- **Node.js** (v16+)
- **MongoDB** (Local or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/promanage.git](https://github.com/your-username/promanage.git)
cd promanage

2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder and add your environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Run the backend server:

npm run dev  # or npm run server

3. Frontend Setup
Open a new terminal tab/window:

cd frontend
npm install

Create a .env file in the frontend folder if needed for API base URL:
SERVER_API_URL=http://localhost:5000/api

Run the frontend development server:

npm run dev

👨‍💻 Author
Sanjay P. S.

Full Stack Web Developer
