const Menu = require('../Models/menu');

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Menu.distinct("category");
        res.status(200).json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get all menu items
const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find();
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
    try {
        const {
            Name, Description, price, discount, category, type, fssaiLicense,
            shelfLife, returnPolicy, storageTips, unitNumber, unit, keyFeatures,
            manufacturerName, manufacturerAddress, customerCareDetails, deliveryTime
        } = req.body;

        const photos = req.files ? req.files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`) : [];
        const primaryPhoto = photos.length > 0 ? photos[0] : null;
        const otherPhotos = photos.length > 1 ? photos.slice(1) : [];

        let customDetails = {};
        if (Array.isArray(req.body.customKeys) && Array.isArray(req.body.customValues)) {
            req.body.customKeys.forEach((key, idx) => {
                const value = req.body.customValues[idx];
                if (key && value) customDetails[key] = value;
            });
        } else if (req.body.customKeys && req.body.customValues) {
            customDetails[req.body.customKeys] = req.body.customValues;
        }

        const newItem = new Menu({
            Name,
            Description,
            price,
            discount,
            category,
            type,
            fssaiLicense,
            shelfLife,
            returnPolicy,
            storageTips,
            unitNumber,
            unit,
            keyFeatures,
            manufacturerName,
            manufacturerAddress,
            customerCareDetails,
            deliveryTime,
            primaryPhoto,
            photos: otherPhotos,
            customDetails
        });

        console.log("Saving new menu item:", newItem.Name);

        const savedItem = await newItem.save();

        console.log("Item saved with ID:", savedItem._id);

        res.redirect('/menu'); // ✅ redirect to menu page after saving
    } catch (err) {
        console.error('Error adding menu item:', err);
        res.status(500).json({ error: err.message });
    }
};

// Update menu item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const existingItem = await Menu.findById(id);
        if (!existingItem) return res.status(404).send('Menu item not found');

        const photosToDelete = req.body.photosToDelete ? req.body.photosToDelete.split(',') : [];
        const deletePrimaryPhoto = req.body.deletePrimaryPhoto === 'on';

        let filteredPhotos = (existingItem.photos || []).filter(url => !photosToDelete.includes(url));
        let primaryPhoto = existingItem.primaryPhoto;

        if (deletePrimaryPhoto || photosToDelete.includes(primaryPhoto)) {
            primaryPhoto = null;
        }

        const uploadedFiles = req.files || [];
        if (uploadedFiles.length > 0) {
            const uploadedPhotoUrls = uploadedFiles.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
            primaryPhoto = uploadedPhotoUrls[0];
            filteredPhotos = filteredPhotos.concat(uploadedPhotoUrls.slice(1));
        }

        filteredPhotos = filteredPhotos.filter(url => url !== primaryPhoto);

        let customDetails = {};
        if (Array.isArray(req.body.customKeys) && Array.isArray(req.body.customValues)) {
            req.body.customKeys.forEach((key, idx) => {
                const val = req.body.customValues[idx];
                if (key && val) customDetails[key] = val;
            });
        } else if (req.body.customKeys && req.body.customValues) {
            customDetails[req.body.customKeys] = req.body.customValues;
        }

        let updates = { ...req.body, primaryPhoto, photos: filteredPhotos, customDetails };
        delete updates.photosToDelete;
        delete updates.customKeys;
        delete updates.customValues;
        delete updates.deletePrimaryPhoto;

        const updatedItem = await Menu.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedItem) return res.status(404).send('Menu item not found');

        res.redirect('/menu');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Menu.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: 'Menu item not found' });
        res.redirect('/menu');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get single menu item for edit form
const getMenuItemForEdit = async (req, res) => {
    try {
        const menuItemDoc = await Menu.findById(req.params.id);
        if (!menuItemDoc) return res.status(404).send('Menu item not found');

        const menuItem = menuItemDoc.toObject();

        menuItem.customDetailsArray = [];
        if (menuItem.customDetails && typeof menuItem.customDetails === 'object') {
            menuItem.customDetailsArray = Object.entries(menuItem.customDetails).map(([key, value]) => ({ key, value }));
        }

        menuItem.allPhotos = [];
        if (menuItem.primaryPhoto) {
            menuItem.allPhotos.push({ url: menuItem.primaryPhoto, isPrimary: true });
        }
        if (Array.isArray(menuItem.photos)) {
            menuItem.photos.forEach(url => {
                if (url !== menuItem.primaryPhoto) {
                    menuItem.allPhotos.push({ url, isPrimary: false });
                }
            });
        }

        res.render('edit', { menuItem });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllCategories,
    getAllMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemForEdit
};
