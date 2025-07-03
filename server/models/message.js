const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema ({
    id: { type: String, required: true },
    subject: { type: String},
    msgText: { type: String, required: true },
    sender: {  type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
});

module.exports = mongoose.model('Message', messagesSchema);
// This line exports the model so it can be used in other files