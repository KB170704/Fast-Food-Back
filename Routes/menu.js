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

router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.array('photos', 10), async (req, res) => {
    try {
        const { Name, Description, price, category, type, fssaiLicense, shelfLife, returnPolicy, storageTips, unit, keyFeatures, manufacturerName, manufacturerAddress, customerCareDetails, deliveryTime, discount } = req.body;

        // Save all uploaded photos
        const photos = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
        const primaryPhoto = photos[0] || null;

        const newMenuItem = new Menu({
            Name,
            Description,
            price,
            category,
            type,
            fssaiLicense,
            shelfLife,
            returnPolicy,
            storageTips,
            unitNumber,
            unit,
            keyFeatures,
            manufacturerName,
            manufacturerAddress,
            customerCareDetails,
            deliveryTime,
            discount,
            photos,
            primaryPhoto
        });

        await newMenuItem.save();
        res.redirect('/menu');
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/:id', authenticateJWT, authorizeRoles('admin'), upload.array('photos', 10), async (req, res) => {
    try {
        const updates = req.body;
        if (req.files && req.files.length > 0) {
            const photos = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            updates.photos = photos;
            updates.primaryPhoto = photos[0]; // first photo as primary
        }

        const updatedItem = await Menu.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedItem) return res.status(404).send('Menu item not found');

        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// Anyone logged in can view
router.get('/item', authenticateJWT, getAllMenuItems);

// Get single menu item by ID
router.get('/item/:id', authenticateJWT, async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Item not found' });
        res.json(menuItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

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

// GET Edit Menu Item
router.get('/edit/:id', async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) return res.status(404).send("Menu item not found");

        res.render('edit', { menuItem }); // pass menuItem with all new fields
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
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
