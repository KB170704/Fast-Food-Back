const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllCategories,
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemForEdit
} = require('../Controllers/menu');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Public Routes (no login required)
router.get('/categories', getAllCategories);
router.get('/item', getAllMenuItems);
router.get('/item/:id', async (req, res) => {
    try {
        const menuItem = await require('../Models/menu').findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Item not found' });
        res.json(menuItem.toObject());
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Protected Admin Routes
router.get('/create', authenticateJWT, authorizeRoles('admin'), (req, res) => res.render('create'));

router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.array('photos', 10), addMenuItem);

router.get('/edit/:id', authenticateJWT, authorizeRoles('admin'), getMenuItemForEdit);

router.post('/:id', authenticateJWT, authorizeRoles('admin'), upload.array('photos', 10), updateMenuItem);

router.get('/delete/:id', authenticateJWT, authorizeRoles('admin'), deleteMenuItem);

// ✅ Admin menu dashboard page
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const menuItems = await require('../Models/menu').find();
        res.render('menu', { menuItems });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
