const mongoose = require('mongoose');

const userAchivementSchema = mongoose.Schema({
    achivementId: {type: String, required: true},
    achivementName: {type: String, required: true},
    achivementDescription: {type: String, required: true},
    achivementCompletePoints: {type: Number, required: true},
    currentPoints: {type: Number, required: true},
});

module.exports = mongoose.model('UserAchivement', userAchivementSchema);
