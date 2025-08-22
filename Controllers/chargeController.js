// controllers/chargeController.js
const Charge = require("../Models/Charge");

// Show all charges
exports.getCharges = async (req, res) => {
    try {
        const charges = await Charge.find();
        res.render("charges/index", { charges });
    } catch (err) {
        res.status(500).send("Error fetching charges");
    }
};

// Show form
exports.getAddCharge = (req, res) => {
    res.render("charges/add");
};

// Create
exports.postAddCharge = async (req, res) => {
    try {
        const { name, amount, freeAbove, active } = req.body;
        const newCharge = new Charge({
            name,
            amount,
            freeAbove: freeAbove || null,
            active: active === "on"
        });
        await newCharge.save();
        res.redirect("/charges");
    } catch (err) {
        res.status(500).send("Error adding charge");
    }
};

// Edit form
exports.getEditCharge = async (req, res) => {
    try {
        const charge = await Charge.findById(req.params.id);
        res.render("charges/edit", { charge });
    } catch (err) {
        res.status(500).send("Error loading charge");
    }
};

// Update
exports.postEditCharge = async (req, res) => {
    try {
        const { name, amount, freeAbove, active } = req.body;
        await Charge.findByIdAndUpdate(req.params.id, {
            name,
            amount,
            freeAbove: freeAbove || null,
            active: active === "on"
        });
        res.redirect("/charges");
    } catch (err) {
        res.status(500).send("Error updating charge");
    }
};

// Delete
exports.deleteCharge = async (req, res) => {
    try {
        await Charge.findByIdAndDelete(req.params.id);
        res.redirect("/charges");
    } catch (err) {
        res.status(500).send("Error deleting charge");
    }
};

// API to get active charges (JSON)
exports.getActiveCharges = async (req, res) => {
    try {
        const charges = await Charge.find({ active: true });
        res.json(charges);
    } catch (err) {
        res.status(500).json({ error: "Error fetching charges" });
    }
};
