const mongoose = require('mongoose');

const achivementSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    completePoints: {type: Number, required: true}
});

module.exports = mongoose.model('Achivement', achivementSchema);
