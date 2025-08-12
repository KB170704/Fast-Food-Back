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

// EJS VIEW ROUTES

// List menu (EJS view)
router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const newMenuItem = new Menu({ Name, Description, price, category, photo });
        await newMenuItem.save();
        res.redirect('/menu');
    } catch (err) {
        console.error('Detailed Error:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Show create form
router.get('/create', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    res.render('menu/create'); // folder: views/menu/create.ejs
});

// Handle new menu creation
router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const newMenuItem = new Menu({ Name, Description, price, category, photo });
        await newMenuItem.save();
        res.redirect('/menu');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Show edit form
router.get('/edit/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) return res.status(404).send('Menu item not found');
        res.render('menu/edit', { menuItem }); // folder: views/menu/edit.ejs
    } catch (err) {
        res.status(500).send('Error retrieving menu item');
    }
});

// Handle update
router.post('/edit/:id', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        let photo = req.body.photo; // For updates, may want to keep old photo if not uploading new one
        if (req.file) {
            photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        await Menu.findByIdAndUpdate(req.params.id, { Name, Description, price, category, photo });
        res.redirect('/menu');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// Handle delete
router.get('/delete/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const deletedItem = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).send('Menu item not found');
        res.redirect('/menu');
    } catch (err) {
        res.status(500).send('Error deleting menu item');
    }
});

// API ROUTES

router.get('/item', authenticateJWT, getAllMenuItems);
router.get('/categories', authenticateJWT, getAllCategories);
// You can add more API routes similarly

module.exports = router;
