const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../Controllers/contact');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Public route to create contact
router.post('/', createContact);

// Only admin can view contact submissions
router.get('/', authenticateJWT, authorizeRoles('admin'), getAllContacts);

module.exports = router;