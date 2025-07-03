const mongoose = require('mongoose');

// Define the schema for a message
const contactSchema = mongoose.Schema ({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    imageUrl: { type: String },
    group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }]
});

// Export the model so it can be used in other files
module.exports = mongoose.model('Contact', contactSchema);