const path = require('path');
const Menu = require('../Models/menu');

// ===== EJS Pages ===== //

// Show Menu List
const renderMenuList = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.render('menu/index', { menus });
    } catch (err) {
        console.error('Error rendering menu list:', err);
        res.status(500).send('Server Error');
    }
};

// Show Add Form
const renderAddForm = (req, res) => {
    res.render('menu/add');
};

// Show Edit Form
const renderEditForm = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).send('Menu item not found');
        res.render('menu/edit', { menu });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// ===== API Endpoints ===== //

const getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct("category");
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: err.message });
    }
};

const getAllMenuItems = async (req, res) => {
    try {
        const items = await Menu.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addMenuItem = async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : null;

        await Menu.create({ Name, Description, price, category, photo });
        res.redirect('/'); // instead of res.json() for EJS pages
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).send('Server Error');
    }
};

const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        let photoUrl = updates.photo;

        if (req.file) {
            photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedItem = await Menu.findByIdAndUpdate(
            id,
            { ...updates, photo: photoUrl },
            { new: true }
        );

        if (!updatedItem) return res.status(404).send('Menu item not found');

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error updating menu item');
    }
};

const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Menu.findByIdAndDelete(id);

        if (!deletedItem) return res.status(404).send('Menu item not found');

        res.redirect('/');
    } catch (err) {
        res.status(400).send('Error deleting menu item');
    }
};

module.exports = {
    // EJS render functions
    renderMenuList,
    renderAddForm,
    renderEditForm,

    // API JSON functions
    getAllCategories,
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};
