const mongoose = require('mongoose');
const actionSchema = require ('../models/action').schema;

const historySchema = mongoose.Schema({
    taskId: {type: String, required: true},
    taskName: {type: String, required: true},
    userId: {type: String, required: true},
    userName: {type: String, required: true},
    groupId: {type: String, required: true},
    groupName: {type: String, required: true},
    date: {type: Date, required: true},
    action: {type: actionSchema, required: true}
});

module.exports = mongoose.model('History', historySchema);
