const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    id: { type: String, required: true },
    sequence_value: { type: Number, required: true }
});

// Export the model so it can be used in other files
module.exports = mongoose.model('Sequence', sequenceSchema);
// This line exports the model so it can be used in other files