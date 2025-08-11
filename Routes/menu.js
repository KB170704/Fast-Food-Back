const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");

// 📌 Show all items (Admin)
router.get("/", async (req, res) => {
    const menu = await Menu.find();
    res.render("menuList", { menu });
});

// 📌 Show create form (Admin)
router.get("/create", (req, res) => {
    res.render("menuCreate");
});

// 📌 Create item (Admin)
router.post("/create", async (req, res) => {
    const { name, price, category, discount, description } = req.body;
    await Menu.create({ name, price, category, discount, description });
    res.redirect("/menu");
});

// 📌 Show edit form (Admin)
router.get("/edit/:id", async (req, res) => {
    const item = await Menu.findById(req.params.id);
    res.render("menuEdit", { item });
});

// 📌 Update item (Admin)
router.post("/edit/:id", async (req, res) => {
    const { name, price, category, discount, description } = req.body;
    await Menu.findByIdAndUpdate(req.params.id, { name, price, category, discount, description });
    res.redirect("/menu");
});

// 📌 Delete item (Admin)
router.get("/delete/:id", async (req, res) => {
    await Menu.findByIdAndDelete(req.params.id);
    res.redirect("/menu");
});

// 📌 API - Get all items (React frontend)
router.get("/api/all", async (req, res) => {
    const menu = await Menu.find();
    res.json(menu);
});

module.exports = router;
