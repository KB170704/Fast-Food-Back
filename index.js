require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const dbconnection = require('./configs/db');
const userRoutes = require("./Routes/user");
const menuRouter = require('./Routes/menu');
const contactRoutes = require('./Routes/contact');
const paymentRoutes = require('./Routes/payment');

const Contact = require('./Models/contact');
const Menu = require('./Models/menu');
const User = require('./Models/user');
const Payment = require('./Models/order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to the database
dbconnection();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// ✅ CORS only allow your frontend (React deployed domain)
app.use(cors({
    origin: 'https://kaushik-six.vercel.app',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/menu", menuRouter);
app.use("/contact", contactRoutes);
app.use("/user", userRoutes);
app.use('/payment', paymentRoutes);

// Home route
app.get("/home", async (req, res) => {
    try {
        const contacts = await Contact.find();
        const menuItems = await Menu.find();
        const users = await User.find();
        const orders = await Payment.find();

        res.render("home", {
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

// Health check
app.get("/Backend-says", (req, res) => {
    res.send("🟢 Render Backend Running");
});

// Show login page
app.get('/', (req, res) => {
    res.render('login');
});

// Handle login
app.post('/user/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid password');

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

// ✅ Only use Render's provided PORT
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`✅ Server running on https://back-wksz.onrender.com`);
});
