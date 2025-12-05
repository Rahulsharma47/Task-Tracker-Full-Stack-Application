# 📝 Task Tracker

A full-stack task management application built with the MERN stack featuring a modern, glassmorphism UI design. Create, manage, and track your tasks with an intuitive and beautiful interface.

![Task Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🔐 **Secure Authentication** - Register and login with email/username
- 📋 **Task Management** - Create, read, update, and delete tasks
- 🎯 **Priority Levels** - Set task priorities (Low, Medium, High)
- 📊 **Status Tracking** - Track tasks through "To Do", "In Progress", and "Done"
- 🔍 **Search & Filter** - Search tasks by title/description and filter by status
- 📅 **Due Dates** - Set and track task deadlines
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- 🔒 **Secure Cookies** - HTTP-only cookies for token storage
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
ACCESS_TOKEN_SECRET=your_random_secret_key_here
REFRESH_TOKEN_SECRET=your_random_refresh_secret_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Generate secure secrets:**
```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```bash
# Start backend server
npm run dev
```

Backend will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

```bash
# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or allow all: 0.0.0.0/0)
5. Get your connection string and add it to backend `.env`

## 📁 Project Structure

```
task-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   └── task.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── task.model.js
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   └── task.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/change-password` - Change password

### Tasks
- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/:id` - Get single task
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task

## 🚢 Deployment

### Deploy Backend to Render

1. Push your backend code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy!

### Deploy Frontend to Vercel

1. Push your frontend code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL`
6. Deploy!

### Production Environment Variables

**Backend on Render:**
```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend on Vercel:**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

## 🎨 UI Features

- **Glassmorphism Design** - Modern frosted glass effect
- **Gradient Accents** - Beautiful color gradients throughout
- **Smooth Animations** - Hover effects and transitions
- **Responsive Layout** - Mobile-first design approach
- **Toast Notifications** - User-friendly feedback messages
- **Loading States** - Clear loading indicators
- **Empty States** - Helpful messages when no data

## 🔒 Security Features

- **HTTP-Only Cookies** - Tokens stored securely
- **Password Hashing** - bcrypt for password security
- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Controlled cross-origin requests
- **Input Validation** - Server-side validation
- **Secure Cookie Settings** - SameSite and Secure flags

## 📱 Screenshots

### Login Page
Modern glassmorphism login interface with animated background

### Dashboard
Clean task management dashboard with stats and filters

### Task Creation
Intuitive modal for creating and editing tasks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Sharma**
- GitHub: https://github.com/Rahulsharma47
- LinkedIn: www.linkedin.com/in/rahul-sharma-410a56253
- Email: realnoob52@gmail.com

## 🙏 Acknowledgments

- Design inspiration from modern web applications
- Tailwind CSS for the amazing utility classes
- React community for excellent documentation
- MongoDB Atlas for reliable database hosting

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**Made with ❤️ and React**

⭐ If you found this project helpful, please give it a star!