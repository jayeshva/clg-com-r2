const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    problem_id: { type: String, required: true },
    user_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const book = mongoose.model('bookmark', bookSchema);

module.exports = book;
