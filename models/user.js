const mongoose = require('mongoose');
const userGroupSchema = require ('../models/userGroup').schema;
const userAchivementSchema = require ('../models/userAchivement').schema;

const userSchema = mongoose.Schema({
  mail: { type: String, required: true},
  password: { type: String, required: true},
  name: { type: String, required: true},
  secondName: { type: String, required: true},
  admin:  {type: Boolean, required: true},
  groups:  {type: [userGroupSchema], required: false},
  achivements:  {type: [userAchivementSchema], required: false},
});

module.exports = mongoose.model('User', userSchema);
