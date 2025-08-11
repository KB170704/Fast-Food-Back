const Menu = require('../Models/Menu');

// Show all items (Admin + API)
exports.getAllMenu = async (req, res) => {
    try {
        const menu = await Menu.find();
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json(menu); // For API
        }
        res.render("menuList", { menu }); // For EJS
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Show create form (EJS)
exports.showCreateForm = (req, res) => {
    res.render("menuCreate");
};

// Create item
exports.createMenu = async (req, res) => {
    try {
        const { name, price, category, discount, description } = req.body;
        const newMenu = new Menu({ name, price, category, discount, description });
        await newMenu.save();
        res.redirect("/menu");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Show edit form
exports.showEditForm = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        res.render("menuEdit", { menu });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Update item
exports.updateMenu = async (req, res) => {
    try {
        const { name, price, category, discount, description } = req.body;
        await Menu.findByIdAndUpdate(req.params.id, { name, price, category, discount, description });
        res.redirect("/menu");
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Delete item
exports.deleteMenu = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.redirect("/menu");
    } catch (err) {
        res.status(500).send(err.message);
    }
};
