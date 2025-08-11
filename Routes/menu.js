const express = require('express');
const router = express.Router();
const Menu = require('../Models/menu');
const upload = require('../middleware/upload');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const { getAllMenuItems, getAllCategories, addMenuItem } = require('../controllers/menu');

// Public routes (if you want them public remove `authenticateJWT`)
router.get('/item', getAllMenuItems);
router.get('/categories', getAllCategories);

// Admin: create menu item
router.post(
    '/create',
    authenticateJWT,
    authorizeRoles('admin'),
    upload.single('photo'),
    async (req, res) => {
        try {
            const { Name, Description, price, category } = req.body;
            const discount = req.body.discount ? Number(req.body.discount) : 0;

            const photo = req.file
                ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                : null;

            const newMenuItem = new Menu({
                Name,
                Description,
                price: Number(price),
                category,
                photo,
                discount
            });

            await newMenuItem.save();
            res.redirect('/menu');
        } catch (err) {
            console.error('Error adding menu item:', err);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;
