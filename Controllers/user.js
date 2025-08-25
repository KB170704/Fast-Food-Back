const bcrypt = require("bcryptjs");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

// Register
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contact, role } = req.body;

        if (!firstName || !lastName || !email || !password || !contact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Save user
        const user = new User({ firstName, lastName, email, password, contact, role: role || "employee" });
        await user.save();

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Create JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                contact: user.contact,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Show all users
const showAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render("users", { users });
    } catch (error) {
        res.status(500).send("Failed to load users");
    }
};

// Form page for adding user
const showAddUserForm = (req, res) => {
    res.render("addUser");
};

// Form page for editing user
const showEditUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.render("editUser", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

// Add user (from form POST)
const addUser = async (req, res) => {
    try {
        const { firstName, lastName, email, contact, password, role } = req.body;
        const user = new User({ firstName, lastName, email, contact, password, role });
        await user.save();
        res.redirect("/user/all");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving user.");
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, contact, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, email, contact, role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).send("User not found");

        res.redirect("/user/all");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/user/all");
    } catch (error) {
        res.status(500).send("Error deleting user");
    }
};

module.exports = {
    registerUser,
    loginUser,
    showAllUsers,
    showAddUserForm,
    showEditUserForm,
    addUser,
    updateUser,
    deleteUser,
};
