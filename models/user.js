const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    problemsSolved: [{
        problem_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
        problem_title: String,
        code: String,
        lang: String
    }],
    problemsAttempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
