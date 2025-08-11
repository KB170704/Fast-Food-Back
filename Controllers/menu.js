const Menu = require('../Models/menu');

exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu items' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct('category');
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

exports.addMenuItem = async (req, res) => {
    try {
        const { Name, Description, price, category, discount } = req.body;
        const photo = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : null;

        const newItem = new Menu({
            Name,
            Description,
            price,
            category,
            photo,
            discount: discount ? Number(discount) : 0
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: 'Error adding menu item' });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Item not found' });

        const { Name, Description, price, category, discount } = req.body;
        if (Name) menuItem.Name = Name;
        if (Description) menuItem.Description = Description;
        if (price) menuItem.price = price;
        if (category) menuItem.category = category;
        menuItem.discount = discount ? Number(discount) : 0;

        if (req.file) {
            menuItem.photo = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        await menuItem.save();
        res.json(menuItem);
    } catch (err) {
        res.status(500).json({ message: 'Error updating menu item' });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting menu item' });
    }
};
