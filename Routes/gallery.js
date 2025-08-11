const express = require('express');
const router = express.Router();
const multer = require('multer');
const methodOverride = require('method-override');
const galleryController = require('../Controllers/gallery');

router.use(methodOverride('_method'));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'), false);
};
const upload = multer({ storage, fileFilter });

// API Route
router.get('/all', galleryController.getAllGalleryAPI);

// UI Routes
router.get('/', galleryController.getAllGalleryItems);
router.get('/add', galleryController.getAddForm);
router.post('/add', upload.single('image'), galleryController.createGalleryItem);
router.get('/edit/:id', galleryController.getEditForm);
router.put('/edit/:id', upload.single('image'), galleryController.updateGalleryItem);
router.post('/delete/:id', galleryController.deleteGalleryItem);

module.exports = router;
