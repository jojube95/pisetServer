const mongoose = require('mongoose');
const stateSchema = require ('../models/state').schema;

const taskSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  groupId: {type: String, required: true},
  userId: {type: String, required: false},
  userName: {type: String, required: false},
  dateIni: {type: Date, required: false},
  dateEnd: {type: Date, required: false},
  estimatedTime: {type: Number, required: false},
  state:  {type: stateSchema, required: false}
});

module.exports = mongoose.model('Task', taskSchema);
