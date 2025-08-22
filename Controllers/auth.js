// controllers/auth.js
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const JWT_SECRET = "your_jwt_secret_key";

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ message: "Registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token, role: user.role });
};