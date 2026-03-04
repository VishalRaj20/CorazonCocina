# Corazon Cocina Mexicana - Full Stack MERN Restaurant Platform

![Corazon Cocina Header](https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

A powerful, modern, and visually stunning restaurant website and full-featured Admin Dashboard. Built specifically for Corazon Cocina Mexicana, this platform offers a seamless online ordering experience for customers and a comprehensive management system for restaurant staff. 

The application is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) and features a premium design system tailored with **TailwindCSS** and animated with **Framer Motion**.

---

## 🌟 Key Features

### For Customers
* **Stunning UI/UX**: A luxury, modern Mexican aesthetic with smooth scroll reveals and page transitions.
* **Dynamic Digital Menu**: Browse categorized dishes with rich descriptions and high-quality images.
* **Online Reservations**: Book tables effortlessly with a responsive reservation form.
* **Advanced Ordering System**: A persistent shopping cart with a robust checkout flow capturing comprehensive delivery details, special instructions, and multiple payment options.
* **Rewards & Promos**: Apply coupon codes and redeem loyalty points directly at checkout.
* **Secure Authentication**: User registration and login using JWT.
* **Order History**: Track past and current orders directly from the user dashboard.

### For Restaurant Administrators
* **Role-Based Access Control**: Secure Admin Panel restricted to authorized staff.
* **Menu Management**: Full CRUD capabilities for menu items, including direct image uploads to Cloudinary.
* **Live Kitchen Orders**: A real-time dashboard to track active orders, view detailed customer/delivery information, and update order statuses (e.g., Processing -> Preparing -> Out for Delivery -> Completed).
* **Reservation Handling**: View all incoming table requests and approve or cancel reservations.
* **User Management**: View all registered users, promote staff to Admin roles, and enable/disable customer accounts.
* **Promos & Rewards System**: Generate custom promo codes, set discount percentages, configure expiry dates/usage limits, and toggle coupons active/inactive.
* **Business Analytics**: A dedicated 'Overview & Stats' tab providing data visualizations (powered by Recharts) for Total Revenue, Total Orders, 7-day Revenue trends, and Top Selling Items.
* **Review Moderation**: Read and approve/delete submitted customer reviews before they appear publicly.

---

## 💻 Tech Stack

**Frontend Framework & UI Models:**
- [React.js (Vite)](https://vitejs.dev/) - Blazing fast frontend build tool.
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI styling.
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library for React.
- [React Router DOM](https://reactrouter.com/) - Declarative routing.
- [Recharts](https://recharts.org/) - Composable charting library built on React components.
- [React Hot Toast](https://react-hot-toast.com/) - Smoking hot React notifications.

**Backend REST API & Database:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - Robust backend server infrastructure.
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - NoSQL database and object modeling.
- [JWT (JSON Web Tokens)](https://jwt.io/) & [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - Secure authentication and password hashing.
- [Cloudinary](https://cloudinary.com/) - Cloud-based media management for menu images.
- [Twilio](https://www.twilio.com/) & [Nodemailer](https://nodemailer.com/) - SMS/WhatsApp and Email notification engine integrations.

---

## 📂 Project Structure

The repository is organized into a mono-repo structure containing both frontend and backend codebases.

```text
corazona-cocina/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI parts (Navbar, Cart, PrivateRoute, etc.)
│   │   ├── context/          # Global State Management (AuthContext, CartContext)
│   │   ├── pages/            # Page-level components (Home, Menu, AdminDashboard)
│   │   └── services/         # API integration (Axios interceptors)
│   └── tailwind.config.js    # Design system / Theme tokens
│
└── backend/                  # Node.js + Express API
    ├── config/               # Database connection strings
    ├── controllers/          # Business logic handlers for API routes
    ├── middleware/           # Auth extraction and Error handling interceptors
    ├── models/               # Mongoose Database Schemas (User, Order, Menu, etc.)
    ├── routes/               # API endpoint definitions
    ├── services/             # External Integrations (Emails, SMS)
    └── server.js             # Express application entry point
```

---

## ⚙️ Environment Variables Setup

You will need to create `.env` files in both the `frontend` and `backend` directories before running the application. Use the provided `.env.example` files as a reference.

### 1. Backend `.env` (`/backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Make an account at https://cloudinary.com/
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Twilio (Optional - SMS Notifications)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Nodemailer (Optional - Email Notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@corazoncocina.com
```

### 2. Frontend `.env` (`/frontend/.env`)
```env
# The URL where your backend is running
VITE_API_URL=http://localhost:5000/api
```
*(In production, change this to your deployed backend URL. Ex: `https://your-api.onrender.com/api`)*

---

## 🛠️ Local Development Guide

### Running the Backend
1. Open a terminal and navigate to the backend directory: 
   ```bash
   cd backend
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Start the dev server (uses nodemon for hot-reloading): 
   ```bash
   npm run dev
   ```
   *The server acts over `http://localhost:5000`*

### Running the Frontend
1. Open a new terminal and navigate to the frontend directory: 
   ```bash
   cd frontend
   ```
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Start the Vite dev server: 
   ```bash
   npm run dev
   ```
   *The application acts over `http://localhost:5173` (or the port Vite specifies).*

---

## 🌐 Deployment Instructions

### Deploying the Backend
1. Create a new Web Service on a platform like [Render](https://render.com/) or [Heroku](https://heroku.com/).
2. Connect your GitHub repository.
3. Set the **Root Directory** to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Very Important: Add all the environment variables from your `/backend/.env` file to the deployment dashboard's Environment Variables section.

### Deploying the Frontend
1. Create a new project on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
2. Connect your GitHub repository.
3. Set the Framework Preset to `Vite`.
4. Set the **Root Directory** to `frontend`.
5. Add the environment variable `VITE_API_URL` pointing strictly to your newly deployed backend URL (e.g., `https://my-backend.onrender.com/api`).
6. Click Deploy.

---

## 🔐 Initializing Admin Access

By default, the first user you create on the website is a standard user, not an Admin. To grant yourself Admin privileges for the first time:

1. Register an account normally via the website (`/login` -> Register).
2. Log in to your **MongoDB Atlas** database via the web console or MongoDB Compass.
3. Open the `corazona` database, then the `users` collection.
4. Find the document matching your registered email.
5. Edit the document and manually change the `role` field to `"admin"` (or set `isAdmin` to `true` depending on schema configuration).
6. Refresh the website or log in again to access the hidden Admin Dashboard routes!

---

*Desarrollado con ❤️ para Corazon Cocina.*
