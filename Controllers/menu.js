const Menu = require('../Models/menu');

exports.getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const { Name, Description, price, category } = req.body;
        const discount = req.body.discount ? Number(req.body.discount) : 0;

        const photo = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : null;

        const newItem = new Menu({
            Name,
            Description,
            price: Number(price),
            category,
            photo,
            discount
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error adding item:', err);
        res.status(500).json({ message: 'Error adding menu item', error: err.message });
    }
};
