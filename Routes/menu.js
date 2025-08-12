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

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Create Menu Item
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.render('menu/index', { menuItems });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        await Menu.create({ Name, Description, price, category, photo });
        res.redirect('/menu'); // ✅ Now works
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Edit Menu
router.get('/edit/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) return res.status(404).send('Menu item not found');
    res.render('menu/edit', { menuItem });
});

router.post('/edit/:id', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), updateMenuItem);

// Delete Menu
router.get('/delete/:id', authenticateJWT, authorizeRoles('admin'), deleteMenuItem);

// API
router.get('/item', authenticateJWT, getAllMenuItems);
router.get('/categories', authenticateJWT, getAllCategories);

module.exports = router;
