const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        required: true,
    },
    updateDate: {
        type: Date,
        required: true,
    }
})

module.exports = mongoose.model('Note', notesSchema);