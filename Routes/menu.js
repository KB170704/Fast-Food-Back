const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

// Admin EJS routes
router.get("/", menuController.getAllMenu);
router.get("/create", menuController.showCreateForm);
router.post("/create", menuController.createMenu);
router.get("/edit/:id", menuController.showEditForm);
router.post("/edit/:id", menuController.updateMenu);
router.get("/delete/:id", menuController.deleteMenu);

// API route for React frontend
router.get("/api/all", async (req, res) => {
    try {
        const menu = await require("../models/Menu").find();
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
