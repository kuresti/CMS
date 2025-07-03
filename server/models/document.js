const mongoose = require('mongoose');

// Define the schema for a document
const documentSchema = mongoose.Schema({
    id: {type: String, required: true},
    name: {type: String, required: true },
    url: {type: String, required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('Document', documentSchema);
// This line exports the model so it can be used in other files