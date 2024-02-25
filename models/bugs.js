const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
    problem_id: { type: String, required: true},
    user_id: { type: String, required: true },
    bugs: { type: String},
    created_at: { type: Date, default: Date.now }

});

const bugs = mongoose.model('Bugs', bugSchema);

module.exports = bugs;
