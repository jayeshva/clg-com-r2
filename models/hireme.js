const mongoose = require('mongoose');

const hiringSchema = new mongoose.Schema({ 
    problem_id: { type: String, required: true},
    session_uuid: {type: String, required: true},
    lang: {type: String, required: true},
    code: {type: String},
    created_at: { type: Date, default: Date.now }

});

const Hiring = mongoose.model('Hiring', hiringSchema);

module.exports = Hiring;
