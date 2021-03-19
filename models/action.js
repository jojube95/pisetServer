const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    time: {type: Number, required: true}
});

module.exports = mongoose.model('Group', groupSchema);
