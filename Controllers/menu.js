// controllers/menu.js

const Menu = require('../Models/menu');

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct("category");
        res.status(200).json(categories);
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
        const {
            Name,
            Description,
            price,
            category,
            type,
            fssaiLicense,
            shelfLife,
            returnPolicy,
            storageTips, unitNumber, unit, keyFeatures, manufacturerName, manufacturerAddress, customerCareDetails, deliveryTime, discount } = req.body;

        const photos = req.files ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) : [];
        const primaryPhoto = photos[0] || null;

        const newItem = new Menu({
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
            primaryPhoto,
            details: dynamicDetails,
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update an existing menu item
// Update a menu item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        let details = {};
        if (req.body.details) {
            if (Array.isArray(req.body.details)) {
                req.body.details.forEach(d => {
                    if (d.key && d.value) details[d.key] = d.value;
                });
            } else if (req.body.details.key && req.body.details.value) {
                details[req.body.details.key] = req.body.details.value;
            }
        }

        let updates = { ...req.body, details };

        if (req.files && req.files.length > 0) {
            const photos = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
            updates.photos = photos;
            updates.primaryPhoto = photos;
        }

        const updatedItem = await Menu.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedItem) return res.status(404).send('Menu item not found');

        res.redirect('/menu');
    } catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).send('Server error');
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