/********************************
 * Required resources
 ********************************/
var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

/********************************
 * GET all documents
 ********************************/
router.get('/', async (req, res, next) => {
    try {
        const documents = await Document.find().exec();
        res.status(200).json({
            message: 'Documents fetched!',
            documents: documents
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred while fetching documents.', 
            error: err
        });
    }

}); 

/**********************************
 * POST a new document
 **********************************/
router.post('/', async (req, res, next) => {
   try {
    const maxDocumentId = sequenceGenerator.nextId('documents');

    const document = new Document({
        id: maxDocumentId,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url
    });

   const createdDocument = await document.save();
        
            res.status(201).json({
                message: 'Document added successfully',
                document: createdDocument
            });
        } catch(err) {
            res.status(500).json({
                message: 'An error occurred',
                error: err
            });
        }
});

/**********************************
 * PUT updating an existing document
 **********************************/
router.put('/:id', async (req, res, next) => {
    try {
        //check if the document exists
        const document = await Document.findOne({ id: req.params.id });

        if (!document) {
            return res.status(500).json({
                message: "Document not found",
                error: { document: "Document not found" }
            });
        }

        //update the document
        document.name = req.body.name;
        document.description = req.body.description;
        document.url = req.body.url;

        await Document.updateOne({ id: req.params.id }, document);

        //return success response
        res.status(204).json({
            message: "Document update successfully", 
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred.",
            error: err
        });
    }
});


/**********************************
 * DELETE a document
 **********************************/
router.delete('/:id', async (req, res, next) => {
    try {
        //check if the document exists
        const document = await Document.findOne({id: req.params.id});

        if (!document) {
            return res.status(500).json({
                message: "Document not found", 
                error: { document: "Document not found" }
            });
        }

        //delete the document
        await Document.deleteOne({ id: req.params.id });

        //return success response
        res.status(204).json({
            message: "Document deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "An error occurred",
            error: err
        });
    }
});

module.exports = router;