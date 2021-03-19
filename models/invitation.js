const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    groupId: {type: String, required: true},
    userId: {type: String, required: true},
});

module.exports = mongoose.model('Invitation', invitationSchema);
