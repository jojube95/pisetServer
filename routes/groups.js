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

router.get('/getByUser:id', (req, res, next) => {
  console.log('Getting user groups');
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
      message: "Success",
      group: createdGroup
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });
});

router.post('/update', (req, res, next) => {
  Group.updateOne({'_id': req.body.group._id}, {
    name: req.body.group.name
  }).then(result => {
    res.status(201).json({
      message: 'Success',
      res: result
    });
  }).catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.post('/delete', (req, res, next) => {
  console.log('Try to delete group to db');
  let resUsers;
  let resTasks;
  let resHistories;

  User.updateMany({}, { $pull: {groups: {'group._id': req.body.groupId}}}).then(res => {
    resUsers = res;
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });

  Task.deleteMany({ groupId: req.body.groupId}).then(res => {
    console.log('Task group deleted');
    resTasks = res;
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });

  History.deleteMany({ groupId: req.body.groupId}).then(res => {
    console.log('Deleted group histories');
    resHistories = res;
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });

  Group.deleteOne({ _id: req.body.groupId }).then(result => {
    console.log('Group deleted');
    res.status(201).json({
      message: "Success",
      res: {
        "users": resUsers,
        "tasks": resTasks,
        "histories": resHistories,
        "group": result
      },
      groupId: req.body.groupId
    });
    }).catch(err => {
    res.status(500).json({
      error : err
    })
  });

});

module.exports = router;
