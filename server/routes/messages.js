/********************************
 * Required resources
 ********************************/
var express = require('express');
var router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

/*********************************
 * GET all messages
 *********************************/
router.get('/', async (req, res, next) => {
    try {
        const messages = await Message.find().exec();
        res.status(200).json({
            message: 'Messages fetched!',
            messages: messages
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching messages.',
            error: err
        });
    }
});

/**********************************
 * POST a new message
 **********************************/
router.post('/', async (req, res, next ) => {
    try {
        const maxMessageId = sequenceGenerator.nextId('messages');

        const message = new Message({
            id: maxMessageId,
            subject: req.body.subject,
            msgText: req.body.msgText,
            sender: req.body.sender
        });

        const createdMessage = await message.save();

        res.status(201).json({
            message: 'Message added successfully',
            message: createdMessage
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occured',
            error: err
        });
    }
});

/**********************************
 * PUT updating an existing message
 **********************************/
router.put('/:id', async (req, res, next) => {
    try {
        // check if the message exists
        const message = await Message.findOne({ id: req.params.id });

        if (!message) {
            return res.status(500).json({
                message: 'Message not fount',
                error: { message: 'Message not fount' }
            });
        }

        //update the message
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = req.body.sender;

        await Message.updateOne({ id: req.params.id }, message);

        //return success response
        res.status(204).json({
            message: 'Message updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred.',
            error: err
        });
    }
});

/**********************************
 * DELETE an existing message
 **********************************/
router.delete('/:id', async (req, res, next) => {
    try {
        //check if the message exists
        const message = await Message.findOne({ id: req.params.id });

        if (!message) {
            return res.status(500).json({
                message: 'Message not found',
                error: { message: 'Message not fount' }
            });
        }
        //delete the message
        await Message.deleteOne({ id: req.params.id });

        //return success response
        res.status(204).json({
            message: 'Message deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred.',
            error: err
        });
    }
});

module.exports = router;