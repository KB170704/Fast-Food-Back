require('dotenv').config();
// const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const dbconnection = require('./configs/db');
const userRoutes = require("./Routes/user");
const menuRouter = require('./Routes/menu');
const contactRoutes = require('./Routes/contact');
const paymentRoutes = require('./Routes/payment');
const galleryRouter = require('./Routes/gallery');

const Gallery = require('./Models/gallery');
const Contact = require('./Models/contact');
const Menu = require('./Models/menu');
const User = require('./Models/user');
// const Payment = require('./Models/order');
const bcrypt = require('bcryptjs'); // Required for login
const jwt = require('jsonwebtoken'); // Required for JWT login

const app = express();

// Connect to the database
dbconnection();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // your React app
  credentials: true  // ✅ allow cookies
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/menu", menuRouter);
app.use("/contact", contactRoutes);
app.use("/user", userRoutes);
app.use('/payment', paymentRoutes);
app.use('/gallery', galleryRouter);

// Home route
// app.get("/home", (req, res) => {
//     res.render("home");
// });
app.get("/home", async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    const contacts = await Contact.find();
    const menuItems = await Menu.find();
    const users = await User.find();
    const orders = await Payment.find();

    res.render("home", {
      galleryItems,
      contacts,
      menuItems,
      users,
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.get("/orders", (req, res) => {
    res.redirect('/orders');
});

// Default route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Show login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid password');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // You can send the token in a cookie or JSON response; here we just send JSON:
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

    // Or redirect somewhere after login, e.g.
    // res.redirect('/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
