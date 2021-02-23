const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    senderMail: {type: String, required: true},
    invitedUserId: {type: String, required: true},
    invitedGroupId: {type: String, required: true},
    invitedGroupName: {type: String, required: true},
});

module.exports = mongoose.model('Invitation', invitationSchema);
