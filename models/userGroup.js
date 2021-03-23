const mongoose = require('mongoose');

const userGroupSchema = mongoose.Schema({
    groupId: {type: String, required: true},
    groupName: {type: String, required: true},
    groupAdmin: {type: Boolean, required: true},
});

module.exports = mongoose.model('UserGroup', userGroupSchema);
