// routes/chargeRoutes.js
const express = require("express");
const router = express.Router();
const chargeController = require("../Controllers/chargeController");

// Show all
router.get("/", chargeController.getCharges);

// Add
router.get("/add", chargeController.getAddCharge);
router.post("/add", chargeController.postAddCharge);

// Edit
router.get("/edit/:id", chargeController.getEditCharge);
router.post("/edit/:id", chargeController.postEditCharge);

// Delete
router.get("/delete/:id", chargeController.deleteCharge);

// Get active charges for frontend
router.get("/active", chargeController.getActiveCharges);

module.exports = router;
