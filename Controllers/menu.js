// controllers/menu.js

const Menu = require('../Models/menu');

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        // Using distinct to get unique categories
        const categories = await Menu.distinct("category");
        res.status(200).json(categories); // Return the categories array
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const items = await Menu.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

        const newItem = new Menu({ Name, Description, price, category, photo });
        const savedItem = await newItem.save();

        res.status(201).json(savedItem);
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update an existing menu item
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

        if (!updatedItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Menu.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        res.status(200).json({ message: "Menu item deleted", deletedItem });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAllCategories, getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };
