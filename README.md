# ShopEase 2.0 🛍️

A full-stack shopping cart app built with React, Node.js and MongoDB. This is an extended version of my Assignment 1 project — I added user accounts, JWT login, and an admin dashboard on top of the existing shop.

## The Problem

My A1 version had no user accounts which meant anyone could see anyone's cart. This version fixes that — users have to log in, carts are tied to each account, and admins can see everything from a dashboard.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT tokens, bcryptjs for password hashing
- **Styling:** Custom CSS
- **Runs on:** localhost:5173 (frontend) and localhost:5000 (backend)

## Features

- Register and login with JWT authentication
- Passwords are hashed with bcryptjs
- Admin and regular user roles
- Each user has their own cart in the database
- Live search and category filters
- Add to cart, update quantity, remove items
- Frequently Bought Together bundle section
- Stock tracking with low stock warnings
- Admin can add, edit and delete products
- Admin can view all users and their carts
- Error banner if the server goes down
- Mobile responsive
- Toast notifications for feedback

## Folder Structure

shopease-a2/
├── backend/
│   ├── models/
│   │   ├── User.js          
│   │   ├── Product.js       
│   │   └── Cart.js          
│   ├── routes/
│   │   ├── auth.js          
│   │   ├── products.js      
│   │   └── cart.js          
│   ├── server.js            
│   ├── seed.js              
│   └── createAdmin.js       
├── frontend/
│   ├── public/
│   │   └── images/          
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx      
│       │   └── CartDrawer.jsx  
│       ├── context/
│       │   └── AuthContext.jsx 
│       ├── pages/
│       │   ├── Home.jsx        
│       │   ├── Login.jsx       
│       │   ├── Register.jsx    
│       │   ├── Profile.jsx     
│       │   └── Admin.jsx       
│       ├── services/
│       │   └── api.js          
│       ├── App.jsx             
│       └── index.css           
└── README.md

## How to Run

1. cd backend && npm install
2. cd frontend && npm install
3. Make sure MongoDB is running
4. cd backend && node seed.js
5. node createAdmin.js
6. node server.js
7. Open a new terminal, cd frontend && npm run dev
8. Go to http://localhost:5173

## Admin Login
- Email: admin@shopease.com
- Password: admin123

## Workload
Done individually by myself as I wrote all the files myself including the backend models, routes, server, and all the React pages, components and styling.

## Challenges

JWT was the hardest part to get right as I had to set up an Axios interceptor so the token automatically gets sent with every request. Switching the cart from a shared "default" session to being tied to each user's ID took some figuring out. React Router with protected routes was new to me since I'd only done vanilla JS before. Getting the admin panel to load each user's cart one by one without it breaking was also tricky. Overall way harder than A1 but I learned a lot about how real authentication actually works.
