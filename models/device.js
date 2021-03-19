const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    deviceId: {type: String, required: true},
    userId: {type: String, required: true}
});

module.exports = mongoose.model('Device', deviceSchema);
