const mongoose = require('mongoose');

const userGroupSchema = mongoose.Schema({
    idGroup: {type: String, required: true},
    idUser: {type: String, required: true},
    groupName: {type: String, required: true},
    groupAdmin: {type: Boolean, required: true},
});

module.exports = mongoose.model('UserGroup', userGroupSchema);
