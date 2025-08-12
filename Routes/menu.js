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

// Protected: Only admin can access these routes
router.get('/create', authenticateJWT, authorizeRoles('admin'), (req, res) => res.render('create'));

router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file ? `http://localhost:8080/uploads/${req.file.filename}` : null;

        const newMenuItem = new Menu({ Name, Description, price, category, photo });
        await newMenuItem.save();
        res.redirect('/menu');
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:id', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), updateMenuItem);

// Anyone logged in can view
router.get('/item', authenticateJWT, getAllMenuItems);
router.get('/categories', authenticateJWT, getAllCategories);

// EJS views
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.render('menu', { menuItems });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/edit/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) return res.status(404).send('Menu item not found');
        res.render('edit', { menuItem });
    } catch (err) {
        res.status(500).send('Error retrieving menu item');
    }
});

router.get('/delete/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedItem = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).send('Menu item not found');
        res.redirect('/menu');
    } catch (err) {
        res.status(500).send('Error deleting menu item');
    }
});

module.exports = router;
