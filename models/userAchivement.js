const mongoose = require('mongoose');

const userAchivementSchema = mongoose.Schema({
    idUser: {type: String, required: true},
    achivementId: {type: String, required: true},
    currentPoints: {type: Number, required: true},
});

module.exports = mongoose.model('UserAchivement', userAchivementSchema);
