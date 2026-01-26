const mongoose = require('mongoose');

const potdSchema = new mongoose.Schema({
    problemId: {
        type: String,
        required: true
    },
    dateAssigned: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('POTD', potdSchema);
