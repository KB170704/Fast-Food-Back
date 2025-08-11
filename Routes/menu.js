const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Menu = require('../Models/menu');
const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    getAllCategories
} = require('../Controllers/menu');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Public GET routes
router.get('/item', getAllMenuItems);
router.get('/categories', getAllCategories);

// Admin routes
router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), addMenuItem);
router.post('/:id', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), updateMenuItem);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), deleteMenuItem);

module.exports = router;
