const express = require('express');
const router = express.Router();
const Menu = require('../Models/menu');
const upload = require('../middleware/upload');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// 📌 Show all items in admin dashboard
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    const items = await Menu.find();
    res.render('menuList', { items });
});

// 📌 Show Create Form (GET)
router.get(
    '/create',
    authenticateJWT,
    authorizeRoles('admin'),
    (req, res) => {
        res.render('create'); // renders views/create.ejs
    }
);

// 📌 Add new menu item
router.post('/create', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const discount = req.body.discount ? Number(req.body.discount) : 0;

        const photo = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : null;

        await Menu.create({
            Name,
            Description,
            price: Number(price),
            category,
            photo,
            discount
        });

        res.redirect('/menu');
    } catch (err) {
        console.error('Error creating item:', err);
        res.status(500).send('Error creating menu item');
    }
});

// 📌 Show edit form
router.get('/edit/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    const item = await Menu.findById(req.params.id);
    res.render('edit', { item });
});

// 📌 Update menu item
router.post('/edit/:id', authenticateJWT, authorizeRoles('admin'), upload.single('photo'), async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const discount = req.body.discount ? Number(req.body.discount) : 0;

        const updateData = {
            Name,
            Description,
            price: Number(price),
            category,
            discount
        };

        if (req.file) {
            updateData.photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        await Menu.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/menu');
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).send('Error updating menu item');
    }
});

// 📌 Delete item
router.get('/delete/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
    await Menu.findByIdAndDelete(req.params.id);
    res.redirect('/menu');
});

// 📌 API: Get all items for frontend
router.get('/item', async (req, res) => {
    const items = await Menu.find();
    res.json(items);
});

module.exports = router;
