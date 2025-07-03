/*********************************
 * Required resources
 *********************************/
var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

/**********************************
 * GET all contacts
 **********************************/
router.get('/', async (req, res, next) => {
    try {
        const contacts = await Contact.find().populate('group');
        res.status(200).json({
            message: 'Contacts fetched!',
            contacts: contacts
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching contacts.',
            error: err
        });
    }
});

/**********************************
 * POST a new contact
 **********************************/
router.post('/', async (req, res, next) => {
    try {
        const maxContactId = sequenceGenerator.nextId('contacts');

        const contact = new Contact({
            id: maxContactId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            imageUrl: req.body.imageUrl
        });

        const createdContact = await contact.save();

        res.status(201).json({
            message: 'Contact added successfully',
            contact: createdContact
        });
    } catch(err) {
        res.status(500).json({
            message: 'An error occurred',
            error: err
        });
    }
});

/**********************************
 * PUT updating an existing contact
 **********************************/
router.put('/:id', async (req,res, next) => {
    try {
        // Check if the contact exists
        const contact = await Contact.findOne({ id: req.params.id });

        if (!contact) {
            return res.status(500).json({
                message: 'Contact not found',
                error: { message: 'Contact not found' }
            });
        }

        // Update the contact
        contact.name = req.body.name;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.imageUrl = req.body.imageUrl;

        await Contact.updateOne({ id: req.params.id }, contact);

        // Return success response
        res.status(200).json({
            message: 'Contact updated successfully',
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred.',
            error: err
        });
    }
});

/**********************************
 * DELETE a contact
 **********************************/
router.delete('/:id', async (req, res, next) => {
    try {
        // Check if the contact exists
        const contact = await Contact.findOne({ id: req.params.id });

        if (!contact) {
            return res. status(500).json({
                message: 'Contact not found',
                error: { message: 'Contact not found' }
            });
        }

        // Delete the contact
        await Contact.deleteOne({ id: req.params.id });

        // Return success response
        res.status(200).json({
            message: 'Contact deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred.',
            error: err
        });
    }
});

module.exports = router;