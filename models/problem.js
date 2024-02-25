const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problem_id: { type: String, required: true, unique: true },
    problem_category: String,
    problem_title: String,
    problem_description: String,
    problem_constraints: { type: String, default: "As per Description" },
    test_cases: [{
        input: String,
        output: String,
        hidden: { type: Boolean, default: false }
    }],
    created_at: { type: Date, default: Date.now }

});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
