const express = require('express');

const MODEL_PATH = '../models/';
const Group = require(MODEL_PATH + 'group');
const User = require(MODEL_PATH + 'user');
const Task = require(MODEL_PATH + 'task');
const History = require(MODEL_PATH + 'history');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

module.exports = function(io) {
  return router;
};


router.get('/get', (req, res, next) => {
  console.log('Getting groups');
  Group.find().then(result =>{
    res.status(200).json({
      message: "Success",
      groups: result
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });
});


router.post('/add', (req, res, next) => {
  console.log('Try to add group to db');
  const group = new Group({
    name: req.body.group.name,
    users: req.body.group.users
  });
  group.save().then(createdGroup => {
    res.status(201).json({
      message: "Post added successfully",
      groupId: createdGroup._id
    });
  });
});

router.post('/delete', (req, res, next) => {
  console.log('Try to delete group to db');

  User.updateMany({}, { $pull: {groups: {groupId: req.body.groupId}}}).then(res => {
    console.log(res);
  });

  Task.deleteMany({ groupId: req.body.groupId}).then(res => {
    console.log('Task group deleted');
  });

  History.deleteMany({ groupId: req.body.groupId}).then(res => {
    console.log('Deleted group histories');
  });

  Group.deleteOne({ _id: req.body.groupId }).then(result => {
    console.log('Group deleted');
    res.status(200).json({ message: "Group deleted!" });
  });

});

module.exports = router;
