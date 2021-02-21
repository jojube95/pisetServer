const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    userId: {type: String, required: true},
    groupId: {type: String, required: true}
});

module.exports = mongoose.model('Invitation', invitationSchema);
