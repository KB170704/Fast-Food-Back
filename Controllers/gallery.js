const Gallery = require('../Models/gallery');

exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find();
    res.render('gallery/all', { menuItems: items });
  } catch (err) {
    res.status(500).send('Error fetching gallery items');
  }
};

exports.getAllGalleryAPI = async (req, res) => {
  try {
    const items = await Gallery.find();
    const formatted = items.map(item => ({
      ...item._doc,
      image: `${req.protocol}://${req.get('host')}/${item.image.replace(/^\/?/, '')}`
    }));
    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
};

exports.getAddForm = (req, res) => {
  res.render('gallery/add');
};

exports.createGalleryItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? 'uploads/' + req.file.filename : '';
    await Gallery.create({ name, description, image });
    res.redirect('/gallery');
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).send('Error saving gallery item');
  }
};

exports.getEditForm = async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  res.render('gallery/edit', { item });
};

exports.updateGalleryItem = async (req, res) => {
  const { name, description } = req.body;
  const updateData = { name, description };
  if (req.file) updateData.image = 'uploads/' + req.file.filename;
  await Gallery.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/gallery');
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.redirect('/gallery');
  } catch (err) {
    res.status(500).send('Error deleting item');
  }
};