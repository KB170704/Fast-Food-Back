const Contact = require('../Models/contact');

exports.createContact = async (req, res) => {
  try {
    console.log('Received contact data:', req.body); // Log incoming data
    const contact = await Contact.create(req.body);
    console.log('Contact saved:', contact);
    res.status(201).json({ message: 'Message send', contact });
  } catch (err) {
    console.error('Error creating contact:', err); // Log error details
    res.status(500).json({ error: err.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('contacts', { contacts });
  } catch (err) {
    res.status(500).send(err.message);
  }
};