const express = require("express");
const {
    registerUser,
    loginUser,
    showAllUsers,
    showAddUserForm,
    showEditUserForm,
    addUser,
    updateUser,
    deleteUser,
} = require("../Controllers/user");

const { authenticateJWT, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected routes
router.use(authenticateJWT);
router.use(authorizeRoles("admin"));

// Admin user management
router.get("/all", showAllUsers);
router.get("/add", showAddUserForm);
router.post("/add", addUser);
router.get("/edit/:id", showEditUserForm);
router.post("/update/:id", updateUser);
router.get("/delete/:id", deleteUser);

module.exports = router;
